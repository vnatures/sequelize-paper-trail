
export interface PaperTrailOptions {
	debug: boolean;
	log: Logger;
	exclude: string[];
	revisionAttribute: string;
	revisionModel: string;
	revisionChangeModel: string;
	enableRevisionChangeModel: boolean;
	UUID: boolean;
	underscored: boolean;
	underscoredAttributes: boolean;
	defaultAttributes: { revisionId: string; documentId: string };
	userModel: boolean;
	userModelAttribute: string;
	enableCompression: boolean;
	enableMigration: boolean;
	enableStrictDiff: boolean;
	continuationNamespace: null;
	continuationKey: string;
	metaDataFields: null;
	metaDataContinuationKey: string;
	mysql: boolean;
}

const defaultOptions: PaperTrailOptions = {
	debug: false,
	log: null,
	exclude: [
		'id',
		'createdAt',
		'updatedAt',
		'deletedAt',
		'created_at',
		'updated_at',
		'deleted_at',
		'revision',
	],
	revisionAttribute: 'revision',
	revisionModel: 'Revision',
	revisionChangeModel: 'RevisionChange',
	enableRevisionChangeModel: false,
	UUID: false,
	underscored: false,
	underscoredAttributes: false,
	defaultAttributes: {
		documentId: 'documentId',
		revisionId: 'revisionId',
	},
	userModel: false,
	userModelAttribute: 'userId',
	enableCompression: false,
	enableMigration: false,
	enableStrictDiff: true,
	continuationNamespace: null,
	continuationKey: 'userId',
	metaDataFields: null,
	metaDataContinuationKey: 'metaData',
	mysql: false,
};

export default defaultOptions;
