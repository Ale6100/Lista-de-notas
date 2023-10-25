import { Link } from 'react-router-dom';

const MessageAutenticate = () => {
    return (
        <div>
            <h2 className='mt-8 text-center font-semibold text-xl'>Por favor <Link className='text-blue-300' to="/login">loguéate</Link> antes de visitar esta página</h2>
        </div>
    );
}

export default MessageAutenticate;
