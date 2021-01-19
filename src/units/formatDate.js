export default function formatDate (date) {
	let d
	if (date) {
		d = new Date(date)
	} else {
		d = new Date()
	}
	const YY = d.getFullYear()
	const MM = d.getMonth()+1
	const DD = d.getDate()
	const HH = d.getHours()
	const mm = d.getMinutes()
	const ss = d.getSeconds()
	return YY + '/' + MM + '/' + DD + ' ' + HH + ":" + mm + ':' + ss
}