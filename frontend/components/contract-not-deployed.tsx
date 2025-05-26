import SwitchNetworkButton from './switch-network-button';

const ContractNotDeployed = () => {
  return (
    <div className=''>
      <h1 className='mb-2'>
        Contract not deployed on this network. Switch to another network.
      </h1>
      <SwitchNetworkButton />
    </div>
  );
};

export default ContractNotDeployed;
