import React, { useEffect, useReducer, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import { ToastAndroid } from 'react-native'
import messaging from '@react-native-firebase/messaging'
export const JobContext = React.createContext()

export const Actions = {
	OnFail: 'onFail',
	Start: 'Start',
	OnStartSuccess: 'onStartSuccess',
	LoadMore: 'LoadMore',
	OnLoadMoreSuccess: 'onLoadMoreSuccess',
	Refresh: 'Refresh',
	OnRefreshSuccess: 'onRefreshSuccess',
	Filter: 'Filter',
	OnFilterSuccess: 'onFilterSuccess',
	Search: 'Search',
	OnSearchSuccess: 'onSearchSuccess',
	ChangeItem: 'ChangeItem',
	OnChangeItemSuccess: 'onChangeItemSuccess',
	OnSavedJobsUpdate: 'onSavedJobsUpdate'
}

const initialState = {
	action: 'Start',
	jobs: [],
	savedJobs: [],
	lastDoc: false,
	hasLoadedAllItems: false,
	loading: true,
	loadingSavedJobs: true,
	searchTerm: '',
	searching: false,
	filters: { category: 'all', jobType: 'all' },
	error: '',
	refreshing: false,
	changingItem: ''
}

function reducer(state, { type, payload }) {
	console.log(type)

	switch (type) {
		case Actions.OnFail:
			console.stack(payload)
			return {
				...state,
				loading: false,
				loadingSavedJobs: false,
				error: payload.message,
				changingItem: '',
				action: type
			}

		case Actions.Start:
			return initialState

		case Actions.OnStartSuccess:
			return {
				...state,
				loading: false,
				jobs: payload.jobs,
				lastDoc: payload.lastDoc,
				action: type
			}

		case Actions.LoadMore:
			return {
				...state,
				loading: true,
				action: type
			}

		case Actions.OnLoadMoreSuccess:
			return {
				...state,
				loading: false,
				hasLoadedAllItems: payload.jobs.length == 0,
				jobs: state.jobs.concat(payload.jobs),
				lastDoc: payload.lastDoc,
				action: type
			}

		case Actions.Refresh:
			return {
				...initialState,
				filters: state.filters,
				searchTerm: state.searchTerm,
				refreshing: true,
				jobs: state.jobs,
				savedJobs: state.savedJobs,
				loadingSavedJobs: state.loadingSavedJobs,
				changingItem: state.changingItem,
				action: type
			}

		case Actions.OnRefreshSuccess:
			return {
				...state,
				loading: false,
				jobs: payload.jobs,
				lastDoc: payload.lastDoc,
				refreshing: false,
				action: type
			}

		case Actions.Filter:
			return {
				...initialState,
				filters: payload,
				searchTerm: state.searchTerm,
				savedJobs: state.savedJobs,
				loadingSavedJobs: state.loadingSavedJobs,
				changingItem: state.changingItem,
				action: type
			}

		case Actions.OnFilterSuccess:
			return {
				...state,
				loading: false,
				jobs: payload.jobs,
				lastDoc: payload.lastDoc,
				action: type
			}

		case Actions.Search:
			return {
				...initialState,
				filters: state.filters,
				searchTerm: payload,
				searching: true,
				jobs: state.jobs,
				savedJobs: state.savedJobs,
				loadingSavedJobs: state.loadingSavedJobs,
				changingItem: state.changingItem,
				action: type
			}

		case Actions.OnSearchSuccess:
			return {
				...state,
				loading: false,
				jobs: payload.jobs,
				lastDoc: payload.lastDoc,
				searching: false,
				action: type
			}

		case Actions.ChangeItem:
			return {
				...state,
				changingItem: payload,
				action: type
			}

		case Actions.OnChangeItemSuccess:
			return {
				...state,
				changingItem: '',
				action: type
			}

		case Actions.OnSavedJobsUpdate:
			return {
				...state,
				savedJobs: payload.jobs,
				changingItem: '',
				loadingSavedJobs: false,
				action: type
			}
		default:
			console.log('DEFAULT RETURN')
			return state
	}
}
const JobColRef = firestore().collection('jobs')

function docsToJobs(snapshot) {
	let jobs = []
	snapshot.docs.forEach(doc => jobs.push(doc.data()))
	return { jobs, lastDoc: snapshot.docs.pop() }
}

let getJobTries = 0
export async function getJob(id) {
	if (getJobTries >= 3) return
	console.log('Get job try', getJobTries + 1)
	getJobTries++
	try {
		let job = (await JobColRef.doc(id).get()).data()
		if (!job) getJob(id)
		return job
	} catch (err) {
		console.log(err)
		getJob(id)
	}
}

const initialCategories = [
	{ name: 'All', value: 'all' },
	{ name: 'Creative design', value: 'creative_design', iconName: 'brush', color: '#AE579F' },
	{ name: 'Business services', value: 'business_services', iconName: 'work-outline', color: '#579CAE' },
	{ name: 'Software', value: 'software', iconName: 'code', color: '#AE8257' },
	{ name: 'Other', value: 'other', iconName: 'tag', color: '#57AE80' }
]

const initialJobTypes = [
	{ name: 'All', value: 'all' },
	{ name: 'Permanent', value: 'Permanent' },
	{ name: 'Part-time', value: 'Part-time' },
	{ name: 'Contractual', value: 'Contractual' },
	{ name: 'Hourly', value: 'Hourly' }
]

const initialBodyProperties = ['Description', 'To Apply']

let userToken

function JobProvider({ children }) {
	const [state, dispatch] = useReducer(reducer, initialState)
	const [categories, setCategories] = useState(initialCategories)
	const [jobTypes, setJobTypes] = useState(initialJobTypes)
	const [bodyProperties, setBodyProperties] = useState(initialBodyProperties)

	const createQuery = () => {
		let q = JobColRef.where('Closed', '==', false).limit(20)
		if (state.searchTerm.trim().length > 0) {
			state.searchTerm.split(' ').forEach(s => {
				if (s.trim().length > 0) q = q.where(`searchKeywords.${s.toUpperCase()}`, '==', true)
			})
		}
		if (state.filters.category !== 'all') q = q.where('Category', '==', state.filters.category)
		if (state.filters.jobType !== 'all') q = q.where('Job Type', '==', state.filters.jobType)

		if (state.lastDoc) q = q.startAfter(state.lastDoc)
		return q
	}

	useEffect(() => {
		if (state.action == Actions.ChangeItem) {
			let docRef = JobColRef.doc(1000000 - parseInt(state.changingItem) + '')
			let promise
			if (state.savedJobs.filter(job => state.changingItem === job.id).length > 0) {
				// job is saved
				promise = docRef.update({ savedBy: firestore.FieldValue.arrayRemove(userToken) })
			} else {
				// job is not saved
				if (state.savedJobs.length >= 20) {
					ToastAndroid.show(`You can't save more than 20 jobs`, ToastAndroid.SHORT)
					dispatch({ type: Actions.OnChangeItemSuccess })
					return
				}
				promise = docRef.update({ savedBy: firestore.FieldValue.arrayUnion(userToken) })
			}
			promise.then(() => dispatch({ type: Actions.OnChangeItemSuccess })).catch(err => dispatch({ type: Actions.OnFail, payload: err }))
		} else if (!state.action.includes('on')) {
			createQuery()
				.get()
				.then(snapshot => {
					dispatch({ type: `on${state.action}Success`, payload: docsToJobs(snapshot) })
				})
				.catch(err => dispatch({ type: Actions.Fail, payload: err }))
		}
	}, [state])

	const observeSavedJobs = async unsubscribe => {
		userToken = await messaging().getToken()
		let q = JobColRef.where('savedBy', 'array-contains', userToken).limit(20)
		unsubscribe = q.onSnapshot(
			snapshot => dispatch({ type: Actions.OnSavedJobsUpdate, payload: docsToJobs(snapshot) }),
			err => dispatch({ type: Actions.OnFail, payload: err })
		)
	}

	const getAppVariables = async () => {
		try {
			let docSnapshot = await firestore().collection('public').doc('appVariables').get()
			setCategories(docSnapshot.data().categories)
			setJobTypes(docSnapshot.data().jobTypes)
			setBodyProperties(docSnapshot.data().bodyProperties)
		} catch (e) {
			console.log(e)
		}
	}

	useEffect(() => {
		getAppVariables()
		let unsubscribe = () => {}
		observeSavedJobs(unsubscribe)
		return unsubscribe
	}, [])

	return (
		<JobContext.Provider
			value={{
				state,
				dispatch,
				categories,
				jobTypes,
				bodyProperties
			}}
		>
			{children}
		</JobContext.Provider>
	)
}

export default JobProvider
