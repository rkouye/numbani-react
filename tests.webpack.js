import Enzyme from 'enzyme'
//TODO: Replace by latest version of enzyme-adapter-react-16
import Adapter from 'enzyme-react-adapter-future'

Enzyme.configure({adapter: new Adapter()});

let context = require.context('./src', true, /\.test\.js$/);
context.keys().forEach(context);

