import {useState} from 'react';
import {Status} from '@/utils/constants';

const StatusView = ({item, show}) => {
    return (
        <>
            {
                show &&
                <div className="absolute card mt-10 pl-5 pr-5">
                    <p>Date: {item.date}</p>
                    <p>Status: {item.status}</p>
                </div>
            }
        </>
    )
}

const ServiceLog = ({item}) => {
    const [show, setShow] = useState(false);

    const statusView = (status) => {
        switch (status) {
            case 'unknown':
                return <div onMouseOver={() => setShow(true)} onMouseLeave={() => setShow(false)}
                            className='bg-gray-300 ml-0.5 sm:rounded-lg flex-1 h-8'>
                    <StatusView item={item} show={show}/>
                </div>;
            case Status.OUTAGE:
                return <div onMouseOver={() => setShow(true)} onMouseLeave={() => setShow(false)}
                            className='bg-red-500 ml-0.5 sm:rounded-lg flex-1 h-8'>
                    <StatusView item={item} show={show}/>
                </div>;
            case Status.PARTIAL_OUTAGE:
                return <div onMouseOver={() => setShow(true)} onMouseLeave={() => setShow(false)}
                            className='bg-orange-300 ml-0.5 sm:rounded-lg flex-1 h-8'>
                    <StatusView item={item} show={show}/>
                </div>;
            default:
                return <div onMouseOver={() => setShow(true)} onMouseLeave={() => setShow(false)}
                            className='bg-green-500 ml-0.5 sm:rounded-lg flex-1 h-8'>
                    <StatusView item={item} show={show}/>
                </div>;
        }
    }
    return (
        <>
            {
                statusView(item.status)
            }
        </ >
    )
}

export default ServiceLog;