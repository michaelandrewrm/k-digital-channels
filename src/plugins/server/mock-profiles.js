import { Response } from 'miragejs';
import { decryptAES } from '@modules/secure/cypher';

export default async function(schema, request) {
	const session = schema.sessions.find(request.requestHeaders.uuid);
	const seed = session?.seed;
	const key = session?.key;
	let user = session?.user;

	if (window.name === 'skyline') {
		[user] = schema.users.all().models.filter(({ documentId }) => documentId === 'A02');
	}

	const { contracts, connectedContract } = user;
	const products = schema.products.all();
	const contract = contracts.models.find(({ id }) => id === connectedContract?.id);
	const profileId = request.params?.profileId;
	let data = {};
	let profile;
	const profiles = contract.profiles.models;

	if (profileId) {
		profile = profiles.find(({ id }) => id === profileId);
	}

	if (request.requestBody) {
		const { payload } = JSON.parse(request.requestBody);
		data = await decryptAES({ seed, key, data: payload });
	}

	if (request.method === 'POST') {
		profile = profiles.find(({ name }) => name === data?.name);

		if (profile) {
			return new Response(400, {}, {});
		}

		const { name, isDefault } = data;
		profile = contract.createProfile({ name, isDefault });

		if (data?.productIds?.length) {
			products.models
				.filter(({ id }) => data.productIds.includes(id))
				.forEach((item) => {
					const profileIds = item?.profiles ?? [];
					item.update('profiles', [...profileIds, { id: profile.id, name: profile.name }]);
				});
		}

		return new Response(200, {}, {});
	}

	if (request.method === 'PUT') {
		if (!profile) {
			return new Response(400, {}, {});
		}

		if (data?.isDefault && profiles?.length) {
			const defaultProfile = profiles.find(({ isDefault }) => isDefault);

			if (defaultProfile) {
				defaultProfile.update({ isDefault: false });
			}
		}

		profile.update('name', data?.name);
		profile.update('isDefault', data?.isDefault);

		const prevProductIds = products.models
			.filter(({ profiles: items }) => items.find(({ id }) => id === profileId))
			.map(({ id }) => id);
		const nextProductIds = data?.productIds;

		const deleteIds = prevProductIds?.filter((id) => !nextProductIds.includes(id));
		const addIds = nextProductIds?.filter((id) => !prevProductIds.includes(id));

		deleteIds.forEach((id) => {
			const product = schema.products.findBy({ id });

			if (product) {
				product.update({
					profiles: product.profiles.filter(({ id: itemId }) => itemId !== profileId),
				});
			}
		});

		addIds.forEach((id) => {
			const product = schema.products.findBy({ id });

			if (product) {
				product.update({
					profiles: [...product.profiles, { id: profileId, name: profile.name }],
				});
			}
		});

		return new Response(200, {}, {});
	}

	if (request.method === 'PATCH') {
		if (!profile) {
			return new Response(400, {}, {});
		}

		if (data?.name) {
			profile.update('name', data?.name);
		}

		profile.update('isDefault', data?.isDefault);

		Object.entries(data).forEach(([field, value]) => {
			if (!['name', 'isDefault'].includes(field)) {
				const product = schema.products.findBy({ id: field });
				const isIncluded = product.profiles.find(({ id }) => id === profileId);

				if (value === 'add' && !isIncluded) {
					product.update('profiles', [...product.profiles, { id: profileId, name: profile.name }]);
				}

				if (value === 'delete' && isIncluded) {
					product.update('profiles', product.profiles.filter(({ id }) => id !== profileId));
				}
			}
		});

		return new Response(200, {}, {});
	}

	if (request.method === 'DELETE') {
		if (!profile) {
			return new Response(400, {}, {});
		}

		profile.destroy();
		products.models
			.filter(({ profiles: productProfiles }) => productProfiles.find(({ id }) => id === profileId))
			.forEach((item) => item.update('profiles', []));

		return new Response(200, {}, {});
	}

	return new Response(200, {}, { profiles: contract.profiles.models });
}
