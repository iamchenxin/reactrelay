/**
 * Created by iamchenxin on 1/18/16.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import {RelayPage} from './rrblog/post';
import {rootR} from './rrblog/relayRoot';


ReactDOM.render(
    <Relay.RootContainer
        Component={RelayPage}
        route={new rootR()}
    />,
    document.getElementById('contain')
);