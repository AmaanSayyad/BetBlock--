// truncate address string into an ellided form
export function truncateAddress(address, start = 5, end = 3) {
	return address.slice(0, start) + '...' + address.slice(address.length - end)
}

export function copyContent(e, content) {
	e.preventDefault();
	e.stopPropagation();
	navigator.clipboard.writeText(content)
}