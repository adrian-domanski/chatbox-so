import React, { Component } from "react";
import {
  Card,
  Button,
  CardHeader,
  CardFooter,
  CardBody,
  CardTitle,
  CardText
} from "reactstrap";

class Info extends Component {
  render() {
    return (
      <Card className="info my-5">
        <CardHeader tag="h3" className="text-center">
          Info:
        </CardHeader>
        <CardBody>
          <CardTitle className="text-center">Active users: 8</CardTitle>
          <CardTitle className="text-center">Top spamers: </CardTitle>
          <CardBody>
            <ul className="text-center spamers">
              <li>1. Siem</li>
              <li>2. Bid</li>
              <li>3. Ek</li>
              <li>4. Arek</li>
              <li>5. Krupa</li>
              <li>6. Dupa</li>
            </ul>
          </CardBody>
        </CardBody>
        <CardFooter className="text-muted text-center">
          Copyright &copy; Adison
        </CardFooter>
      </Card>
    );
  }
}

export default Info;
