import { Link } from 'react-router-dom';

const MessageAutenticate = () => {
    return (
        <div>
            <h1 className='mt-8 text-center font-semibold text-xl'>Por favor <Link className='text-blue-700' to="/login">loguéate</Link> antes de visitar esta página</h1>
        </div>
    );
}

export default MessageAutenticate;
