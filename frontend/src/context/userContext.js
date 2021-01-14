import React from 'react';

const userContext = React.createContext({
    user: {
        email: "",
        id: "",
        isAdmin: 0,
        name: "",
        profilePicture: null,
        categories: [],

    },
    categories: [],
    open: false,

});
export default userContext;