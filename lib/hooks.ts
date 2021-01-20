import { forEach, pick, omit, keys, pickBy } from 'lodash';
import { PaperTrailOptions } from "./defaults";

const createBeforeHook = <T>(operation: string, options: PaperTrailOptions) => {
	log = options.log || console.log;
	const beforeHook = function beforeHook(instance: T, opt) {
		if (options.debug) {
			log('beforeHook called');
			log('instance:', instance);
			log('opt:', opt);
		}

		if (opt.noPaperTrail) {
			if (options.debug) {
				log('noPaperTrail opt: is true, not logging');
			}
			return;
		}

		const destroyOperation = operation === 'destroy';

		let previousVersion = {};
		let currentVersion = {};
		if (!destroyOperation && options.enableCompression) {
			forEach(opt.defaultFields, a => {
				previousVersion[a] = instance._previousDataValues[a];
				currentVersion[a] = instance.dataValues[a];
			});
		} else {
			previousVersion = instance._previousDataValues;
			currentVersion = instance.dataValues;
		}
		// Supported nested models.
		previousVersion = pick(previousVersion, Object.keys(instance.rawAttributes));
		previousVersion = omit(previousVersion, options.exclude);

		currentVersion = pick(currentVersion, Object.keys(instance.rawAttributes));
		currentVersion = omit(currentVersion, options.exclude);

		// Disallow change of revision
		instance.set(
			options.revisionAttribute,
			instance._previousDataValues[options.revisionAttribute],
		);

		// Get diffs
		const delta = helpers.calcDelta(
			previousVersion,
			currentVersion,
			options.exclude,
			options.enableStrictDiff,
		);

		const currentRevisionId = instance.get(options.revisionAttribute);

		if (failHard && !currentRevisionId && opt.type === 'UPDATE') {
			throw new Error('Revision Id was undefined');
		}

		if (options.debug) {
			log('delta:', delta);
			log('revisionId', currentRevisionId);
		}
		// Check if all required fields have been provided to the opts / CLS
		if (options.metaDataFields) {
			// get all required field keys as an array
			const requiredFields = keys(
				pickBy(
					options.metaDataFields,
					function isMetaDataFieldRequired(required) {
						return required;
					},
				),
			);
			if (requiredFields && requiredFields.length) {
				const metaData =
					(ns && ns.get(options.metaDataContinuationKey)) ||
					opt.metaData;
				const requiredFieldsProvided = filter(
					requiredFields,
					function isMetaDataFieldNonUndefined(field) {
						return metaData[field] !== undefined;
					},
				);
				if (
					requiredFieldsProvided.length !== requiredFields.length
				) {
					log(
						'Required fields: ',
						options.metaDataFields,
						requiredFields,
					);
					log(
						'Required fields provided: ',
						metaData,
						requiredFieldsProvided,
					);
					throw new Error(
						'Not all required fields are provided to paper trail!',
					);
				}
			}
		}

		if (destroyOperation || (delta && delta.length > 0)) {
			const revisionId = (currentRevisionId || 0) + 1;
			instance.set(options.revisionAttribute, revisionId);

			if (!instance.context) {
				instance.context = {};
			}
			instance.context.delta = delta;
		}

		if (options.debug) {
			log('end of beforeHook');
		}
	};
	return beforeHook;
}
