import { getDevData, approveGuide, upgradeHostToLegend, resetOrder, updateVisitorLocation } from './actions';
import { BackButton } from "@/components/BackButton";

interface DevGuide {
  id: string;
  title: string;
  host: { nickname: string };
}

interface DevHost {
  id: string;
  nickname: string;
  email: string;
  level: number;
  legendStatus: string;
}

interface DevVisitor {
  id: string;
  email: string;
  location?: string | null;
}

interface DevOrder {
  id: string;
  orderStatus: string;
  visitor: { email: string };
  host: { nickname: string };
}

export default async function DevPage() {
  const { pendingGuides, hosts, orders, visitors } = await getDevData();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <BackButton />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Developer Control Panel 🛠️</h1>
        
        {/* Pending Guides Section */}
        <section className="mb-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Pending Guides 
              <span className="ml-2 text-sm font-normal text-gray-500">({pendingGuides.length})</span>
            </h2>
          </div>
          
          {pendingGuides.length === 0 ? (
            <p className="text-gray-500 italic">No guides currently under review.</p>
          ) : (
            <div className="grid gap-4">
              {pendingGuides.map((guide: DevGuide) => (
                <div key={guide.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <h3 className="font-medium text-gray-900">{guide.title}</h3>
                    <p className="text-sm text-gray-500">Host: {guide.host.nickname}</p>
                    <p className="text-xs text-gray-400 mt-1">ID: {guide.id}</p>
                  </div>
                  <form action={approveGuide.bind(null, guide.id)}>
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
                    >
                      Approve Guide ✅
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Hosts Section */}
        <section className="mb-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Host Management
            <span className="ml-2 text-sm font-normal text-gray-500">({hosts.length})</span>
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Host</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Legend Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {hosts.map((host: DevHost) => (
                  <tr key={host.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-0">
                          <div className="text-sm font-medium text-gray-900">{host.nickname}</div>
                          <div className="text-sm text-gray-500">{host.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        host.level === 5 ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        Level {host.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {host.legendStatus}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {host.level < 5 && (
                        <form action={upgradeHostToLegend.bind(null, host.id)}>
                          <button 
                            type="submit"
                            className="text-indigo-600 hover:text-indigo-900 font-medium"
                          >
                            Upgrade to Legend ⚡️
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Visitors Section */}
        <section className="mb-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Visitor Location Simulator
            <span className="ml-2 text-sm font-normal text-gray-500">({visitors.length})</span>
          </h2>
          
          <div className="grid gap-4">
            {visitors.map((visitor: DevVisitor) => (
              <div key={visitor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <h3 className="font-medium text-gray-900">{visitor.email}</h3>
                  <p className="text-sm text-gray-500">Current Location: {visitor.location || 'Unknown'}</p>
                </div>
                <form action={updateVisitorLocation} className="flex items-center gap-2">
                  <input type="hidden" name="visitorId" value={visitor.id} />
                  <input 
                    name="location" 
                    placeholder="New Location (e.g. NYC)" 
                    defaultValue={visitor.location || ''}
                    className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button 
                    type="submit"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                  >
                    Update
                  </button>
                </form>
              </div>
            ))}
          </div>
        </section>

        {/* Orders Section */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Order Debugging
            <span className="ml-2 text-sm font-normal text-gray-500">({orders.length})</span>
          </h2>
          
          <div className="grid gap-4">
            {orders.map((order: DevOrder) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      order.orderStatus === 'WAITING' ? 'bg-yellow-100 text-yellow-800' :
                      order.orderStatus === 'EXECUTED' ? 'bg-blue-100 text-blue-800' :
                      order.orderStatus === 'SUBMITTED' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.orderStatus}
                    </span>
                    <span className="text-sm font-medium text-gray-900">Order #{order.id.slice(0, 8)}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Visitor: {order.visitor.email} → Host: {order.host.nickname}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <form action={resetOrder.bind(null, order.id)}>
                    <button 
                      type="submit"
                      className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded transition-colors"
                    >
                      Reset to WAITING ↺
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
