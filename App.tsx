import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from 'native-base';
import { Routes} from './scr/Routes/routes';
import { UserProvider } from './scr/contexts/UserContext';
import auth from '@react-native-firebase/auth';
import { FirebaseProvider } from './scr/contexts/FirebaseContext';


export default function App() {
  return (
    <NativeBaseProvider>
      <FirebaseProvider>
        <UserProvider>
          <StatusBar style="auto" />
          <Routes/>
        </UserProvider>    
      </FirebaseProvider>
    </NativeBaseProvider>
  );
}
