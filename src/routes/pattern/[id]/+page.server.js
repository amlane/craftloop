export const load = async ({ params }) => {
	console.log(params);

	return {
		patternId: params.id
	};
};
