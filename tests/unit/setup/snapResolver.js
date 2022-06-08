module.exports = {
	resolveSnapshotPath: (testPath, snapshotExtension) =>
		testPath.replace(/\.unit\.(js?)/, snapshotExtension),

	resolveTestPath: (snapshotFilePath, snapshotExtension) =>
		snapshotFilePath.replace(snapshotExtension, '.unit.js'),

	// Example test path, used for preflight consistency check of the implementation above
	testPathForConsistencyCheck: 'some/example.unit.js',
};
