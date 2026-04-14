function Admin() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded shadow">Total Products: 120</div>
        <div className="p-4 bg-white rounded shadow">Orders Today: 15</div>
        <div className="p-4 bg-white rounded shadow">Revenue: ₹12,500</div>
        <div className="p-4 bg-white rounded shadow">Coupons Active: 5</div>
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Recent Orders</h2>
        <div className="bg-white p-4 rounded shadow">
          <p>#1234 - ₹1200 - Delivered</p>
          <p>#1235 - ₹800 - Pending</p>
        </div>
      </div>
    </div>
  );
}

export default Admin;
