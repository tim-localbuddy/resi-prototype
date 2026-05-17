import { useNavigate } from 'react-router-dom';

export function BuildingsTab() {
  const navigate = useNavigate();

  return (
    <>
      <div className="ph">
        <div><div className="pt">Agent Portfolio</div><div className="ps">Manage all your buildings from one place</div></div>
      </div>
      
      <div className="block-card">
        <div className="block-name">Maple House</div>
        <div className="block-addr">42 Elm Road, London E1 4AB</div>
        <div className="block-stats">
          <div className="bstat"><div className="bstat-val">3</div><div className="bstat-lbl">Open Issues</div></div>
          <div className="bstat"><div className="bstat-val">2</div><div className="bstat-lbl">Overdue</div></div>
          <div className="bstat"><div className="bstat-val" style={{ color: 'var(--green)' }}>98%</div><div className="bstat-lbl">Compliance</div></div>
        </div>
        <button className="btn btn-outline btn-sm mt-4" onClick={() => navigate('/committee')}>Log in as Committee →</button>
      </div>
    </>
  );
}
