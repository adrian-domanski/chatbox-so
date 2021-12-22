import React, { Component } from 'react';
import { Card, CardHeader, CardFooter, CardBody, CardTitle } from 'reactstrap';
import openSocket from 'socket.io-client';
const socket = openSocket('/');

class Info extends Component {
  state = {
    user_count: 0,
    spamers: [],
  };

  componentDidMount() {
    // Catch active users emit
    socket.on('active', (data) => {
      const users = Math.floor(data / 2);
      this.setState({ user_count: users });
    });

    // Catch spamers emit
    socket.on('spamers', (users) => {
      this.setState({ spamers: users });
    });
  }

  render() {
    const { user_count, spamers } = this.state;
    const top = spamers.length
      ? spamers.map((spamer, pos) => (
          <li key={spamer._id}>
            {pos + 1}. {spamer.name} ({spamer.msg_count})
          </li>
        ))
      : 'Loading...';

    return (
      <Card className='info'>
        <CardHeader tag='h3' className='text-center'>
          Information:
        </CardHeader>
        <CardBody>
          <CardTitle className='text-center'>
            <strong>Active users</strong>:{' '}
            <span className='text-success'>{user_count}</span>
          </CardTitle>
          <CardTitle className='text-center'>
            <strong>Spamers: </strong>
          </CardTitle>
          <ul className='text-center spamers'>{top}</ul>
        </CardBody>
        <CardFooter className='text-muted text-center copy'>
          Copyright &copy;{' '}
          <a target='_blank' href='https://kodario.pl/' className='text-muted'>
            Kodario.pl
          </a>
        </CardFooter>
      </Card>
    );
  }
}

export default Info;
