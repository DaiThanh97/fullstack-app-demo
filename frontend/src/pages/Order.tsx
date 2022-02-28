import styled from 'styled-components';
import { Route, Routes } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

import Info from '../modules/Orders/pages/Info';
import List from './../modules/Orders/pages/List';
import Create from '../modules/Orders/pages/Create';

import { ReactComponent as Logo } from './../assets/images/logo.svg';

const Holder = styled(Container)`
  margin-top: 100px;
`;

const LogoSvg = styled(Logo)`
  margin-bottom: 30px;
`;

const OrdersPage: React.FC = () => {
  return (
    <Holder>
      <LogoSvg />
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/info/:orderId" element={<Info />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </Holder>
  );
};

export default OrdersPage;
