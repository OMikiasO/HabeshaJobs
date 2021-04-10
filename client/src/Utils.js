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
	content += `Get the app at https://play.google.com/store/apps/details?id=com.chaosapps.habeshajobs\n\n`
	content += 'Contact\n'
	for (let i = 0; i < job.Contacts.length; i++) {
		const contact = job.Contacts[i]
		content += `-> ${contact.name} - ${contact.icon == 'telegram-plane' ? '@' : ''}${contact.contact ? contact.contact : contact.link}\n`
	}

	return content
}

export const NOTIFICATION_SETTINGS = 'notification settings'
export const FIRST_OPEN = ''
