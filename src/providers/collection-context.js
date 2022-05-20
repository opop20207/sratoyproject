import React from "react";

const CollectionContext = React.createContext({
    contract: null,
    collection: [],
    loadContract: () => {},
    loadCollection: () => {},
});

export default CollectionContext;
