// Configure a client instance
import KeenTracking from 'keen-tracking';

// This is your actual Project ID and Write Key
const client = new KeenTracking({
  projectId: '5abbac69c9e77c0001b462de',
  writeKey:
    '5098C82C8D460D7478EF82CB1E16B55A2F30EBDD6548FDDB49A37FE5D97A281F2C5BDF826AACD394530D3EE5807F7AAE8889BD917D83D31DAD74C79B5F1818703CBEAB0D204BC28E1BB468499A51FC53E3D636AE70D1E7E72FCA0C4C1404FF95'
});

export default client;
