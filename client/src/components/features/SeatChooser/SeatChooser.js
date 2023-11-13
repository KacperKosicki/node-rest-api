import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Progress, Alert } from 'reactstrap';
import { getSeats, loadSeatsRequest, getRequests } from '../../../redux/seatsRedux';
import io from 'socket.io-client';
import './SeatChooser.scss';

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => savedCallback.current();
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const SeatChooser = ({ chosenDay, chosenSeat, updateSeat }) => {
  const dispatch = useDispatch();
  const seats = useSelector(getSeats);
  const requests = useSelector(getRequests);

  const [freeSeatsCount, setFreeSeatsCount] = useState(0);

  const isTaken = (seatId) => {
    return seats.some((item) => item.seat === seatId && item.day === chosenDay);
  };

  const updateFreeSeatsCount = () => {
    const totalSeats = 50; // Zakładamy, że masz 50 miejsc
    const takenSeatsCount = seats.filter((item) => item.day === chosenDay).length;
    const freeSeats = totalSeats - takenSeatsCount;
    setFreeSeatsCount(freeSeats);
  };

  const fetchSeatsData = async () => {
    await dispatch(loadSeatsRequest());
    updateFreeSeatsCount();
  };

  useEffect(() => {
    dispatch(loadSeatsRequest());
  }, [dispatch]);

  useEffect(() => {
    if (chosenSeat) {
      fetchSeatsData();
    }
  }, [chosenSeat]);

  useInterval(fetchSeatsData, 120000);

  const prepareSeat = (seatId) => {
    if (seatId === chosenSeat) return <Button key={seatId} className="seats__seat" color="primary">{seatId}</Button>;
    else if (isTaken(seatId)) return <Button key={seatId} className="seats__seat" disabled color="secondary">{seatId}</Button>;
    else return <Button key={seatId} color="primary" className="seats__seat" outline onClick={(e) => updateSeat(e, seatId)}>{seatId}</Button>;
  };

  return (
    <div>
      <h3>Pick a seat</h3>
      <p>Free seats: {freeSeatsCount}/50</p>
      <div className="mb-4">
        <small id="pickHelp" className="form-text text-muted ms-2"><Button color="secondary" /> – seat is already taken</small>
        <small id="pickHelpTwo" className="form-text text-muted ms-2"><Button outline color="primary" /> – it's empty</small>
      </div>
      {requests['LOAD_SEATS'] && requests['LOAD_SEATS'].success && <div className="seats">{[...Array(50)].map((x, i) => prepareSeat(i + 1))}</div>}
      {requests['LOAD_SEATS'] && requests['LOAD_SEATS'].pending && <Progress animated color="primary" value={50} />}
      {requests['LOAD_SEATS'] && requests['LOAD_SEATS'].error && <Alert color="warning">Couldn't load seats...</Alert>}
    </div>
  );
};

export default SeatChooser;