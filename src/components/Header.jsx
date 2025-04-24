import './style.css';
import moment from 'moment';
import Button from './Button.jsx';

export default function Header({ someMoment, prev, next, index }) {

    return <div className='header'>
        <Button text={'<'} color={'red'} fontSize={20} handleClick={prev}></Button>
        <div style={{ fontWeight: 'bold' }}>{`${someMoment.format('MMMM YYYY').toUpperCase()}`}</div>
        <Button text={'>'} color={'red'} fontSize={20} handleClick={next}></Button>
    </div>
}