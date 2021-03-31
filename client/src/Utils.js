export const getIconNameForCat = cat => {
	switch (cat) {
		case 'business_services':
			return { iconName: 'work-outline', color: '#579CAE' }
		case 'software':
			return { iconName: 'code', color: '#AE8257' }
		case 'creative_design':
			return { iconName: 'brush', color: '#AE579F' }
		default:
			return { iconName: 'tag', color: '#57AE80' }
	}
}

export const createTopicFromFilter = filters => {
	let topic = ''
	if (filters.category != 'all') topic += filters.category
	if (filters.jobType != 'all') topic += filters.jobType
	return topic
}

export const createShareContent = job => {
	let content = ''
	content += `Job Title : ${job['Job Title']}\n\n`
	if (job['Job Type']) content += `Job Type : ${job['Job Type']}\n\n`
	if (job.Company) content += `Company : ${job.Company}\n\n`
	if (job.Description) content += `Description : ${job.Description}\n\n`

	return content
}

export const NOTIFICATION_SETTINGS = 'notification settings'
