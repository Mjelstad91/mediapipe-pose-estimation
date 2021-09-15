import React, { useEffect, useState } from 'react';

import { LineChart, Line, XAxis, YAxis } from 'recharts';

type Data = {
  value: number;
  time: string;
};

type Props = {
  kneeDistance: number;
};
const Test = ({ kneeDistance }: Props) => {
  const [data, setData] = useState<Data[]>([
    { value: 0.2, time: '' },
    { value: 0.15, time: '' },
    { value: 0.24, time: '' },
  ]);

  useEffect(() => {
      console.log(kneeDistance, "USEEFFECT fra chartcomponent.")
  }, [kneeDistance]);

  const testeknappen = () => {
    console.log(kneeDistance, ' KNEEDSITANCe..');
    setData((c) => [...c, { value: Math.random(), time: '' }]);
  };

  return (
    <div style={{ backgroundColor: 'white' }}>
      <div
        style={{ width: 200, height: 50, backgroundColor: 'blue' }}
        onClick={() => {
          testeknappen();
        }}
      >
        <p style={{ color: 'red' }}>skje ting knappen.</p>
      </div>
      <div>
        <LineChart width={500} height={300} data={data}>
          <XAxis dataKey="time" />
          <YAxis />
          <Line dataKey="value" stroke="blue" />
        </LineChart>
      </div>
    </div>
  );
};
export default Test;
