import React from 'react';
import { Container,Button } from '@material-ui/core';
import '../../styles/Schedule.scss';
export default function Schedule(){
  return(
    <Container className="schedule">
      <Button>Book Your Schedule</Button>
    </Container>
  );
}