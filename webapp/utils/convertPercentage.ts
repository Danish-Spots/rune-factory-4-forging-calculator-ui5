export function convertPercentage(stat: float): string {
	if (!stat) return stat as unknown as string;
	if (stat.toString().includes('.')) {
		return `${stat * 100} %`;
	}
	return stat.toString();
}
