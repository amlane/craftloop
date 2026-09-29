// Mirrors the SUPPLY_TYPES enum in craftloop-api (patterns/pattern-schemas.js).
// Kept as a plain duplicated constant rather than a shared package, matching
// how WEIGHTS/STATUSES are already duplicated between the two repos.
export const SUPPLY_TYPES = [
	{ key: 'hook', label: 'Hook' },
	{ key: 'needle', label: 'Yarn needle' },
	{ key: 'scissors', label: 'Scissors' },
	{ key: 'stitch_markers', label: 'Stitch markers' },
	{ key: 'safety_eyes', label: 'Safety eyes' },
	{ key: 'pom_pom_maker', label: 'Pom pom maker' },
	{ key: 'stuffing', label: 'Stuffing' },
	{ key: 'other', label: 'Other' }
];

export function supplyTypeLabel(key) {
	return SUPPLY_TYPES.find((t) => t.key === key)?.label ?? key;
}
