import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';

export default createAppContainer(
    createSwitchNavigator({
        Login,
        Signup,
        Home,
    })
);