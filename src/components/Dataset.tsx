import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { thunkGetDatasets } from '../thunks';

import { RootState } from '../store';

const mapState = (state: RootState) => ({
    files: state.dataset.files,
});

const mapDispatch = {
    getDatasets: thunkGetDatasets,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

const Dataset = (props: Props) => {
    const { files, getDatasets } = props;

    useEffect(() => {
        getDatasets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            {files.map((file, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <p key={index}>{file}</p>
            ))}
        </div>
    );
};

export default connector(Dataset);
