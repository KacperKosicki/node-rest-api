import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Progress, Alert } from 'reactstrap';
import io from 'socket.io-client';
import { loadSeatsRequest, getSeats, getRequests } from '../../../redux/seatsRedux';
import './SeatChooser.scss';

const SeatChooser = ({ chosenDay, chosenSeat, updateSeat }) => {
  const dispatch = useDispatch();
  const seats = useSelector(getSeats);
  const requests = useSelector(getRequests);
  const [freeSeatsCount, setFreeSeatsCount] = useState(0);

  useEffect(() => {
    const socket = io(process.env.NODE_ENV === 'production' ? '' : 'ws://localhost:8000', { transports: ['websocket'] });
  
    socket.on('seatsUpdated', () => {
      dispatch(loadSeatsRequest());
    });
  
    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadSeatsRequest());
  }, [dispatch]);

  useEffect(() => {
    const totalSeats = 50;
    const takenSeatsCount = seats.filter((item) => item.day === chosenDay).length;
    const freeSeats = totalSeats - takenSeatsCount;
    setFreeSeatsCount(freeSeats);
  }, [seats, chosenDay]);

  const prepareSeat = (seatId) => {
    if (seatId === chosenSeat) return <Button key={seatId} className="seats__seat" color="primary">{seatId}</Button>;
    else if (isTaken(seatId)) return <Button key={seatId} className="seats__seat" disabled color="secondary">{seatId}</Button>;
    else return <Button key={seatId} color="primary" className="seats__seat" outline onClick={(e) => updateSeat(e, seatId)}>{seatId}</Button>;
  };

  const isTaken = (seatId) => {
    return seats.some((item) => item.seat === seatId && item.day === chosenDay);
  };

  return (
    <div>
      <h3>Pick a seat</h3>
      <div className="mb-4">
        <small id="pickHelp" className="form-text text-muted ms-2"><Button color="secondary" /> – seat is already taken</small>
        <small id="pickHelpTwo" className="form-text text-muted ms-2"><Button outline color="primary" /> – it's empty</small>
      </div>
      {requests['LOAD_SEATS'] && requests['LOAD_SEATS'].success && <div className="seats">{[...Array(50)].map((x, i) => prepareSeat(i + 1))}</div>}
      {requests['LOAD_SEATS'] && requests['LOAD_SEATS'].pending && <Progress animated color="primary" value={50} />}
      {requests['LOAD_SEATS'] && requests['LOAD_SEATS'].error && <Alert color="warning">Couldn't load seats...</Alert>}
      <h6 className='freeSeats'>Free seats: {freeSeatsCount}/50</h6>
    </div>
  );
};

export default SeatChooser;