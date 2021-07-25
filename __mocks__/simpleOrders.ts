import moment from 'moment';
import mock from 'src/utils/mock';
import type { Order } from 'src/types/simpleorder';

mock.onGet('/api/sos').reply(() => {
  const orders: Order[] = [
    
  ];
  return [200, { orders }];
});

