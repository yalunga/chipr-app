import React, { Component } from 'react';

import Protected from '../protected';
import UserLayout from '../nav/user-layout';

export default class Home extends Component {
  render() {
    return (
      <Protected>
        <UserLayout>
          Hello World
        </UserLayout>
      </Protected>
    );
  }
}