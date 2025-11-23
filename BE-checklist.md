# ✅ Backend Design Checklist (with Example Answers)

_Imagine you’re building an Order API for your café ☕._

## 1. Data Flow
**Q:** Where is the data coming from? Where does it go?  
**A:** From the frontend (customer places order) → goes into Postgres orders table → triggers inventory update → optionally pushes to a queue for email receipt.  

## 2. Storage
**Q:** What DB suits this? Indexing? Retention?  
**A:** Use Postgres (structured relational data).  
- Add index on `order_id`, `customer_id`, `created_at`.  
- Keep data indefinitely (legal + analytics).  

## 3. Consistency & Concurrency
**Q:** What if two users order the last coffee at the same time?  
**A:** Use a transaction → check stock before confirming → decrement stock atomically.  
- Strict consistency required here (no overselling).  

## 4. Performance
**Q:** Will it slow down with load? Cache needed? Async?  
**A:** Orders API = real-time, must be fast.  
- Use Redis cache for inventory lookups.  
- For receipts → push to queue (RabbitMQ/Kafka) so emails don’t block API.  

## 5. Security
**Q:** Is sensitive data safe? Auth in place? Vulnerabilities?  
**A:**  
- Passwords = hashed with bcrypt.  
- JWT-based auth → only logged-in users can order.  
- Validate inputs to prevent SQL injection / XSS.  
- Use HTTPS only.  

## 6. Scalability & Maintenance
**Q:** Will it scale 100x? Is it maintainable? Logs/metrics?  
**A:**  
- Yes → use horizontal scaling for API servers.  
- Postgres → shard/archive old data if needed.  
- Logs in Winston + metrics in Prometheus/Grafana.  
- Clear folder structure + error handling middleware.  

# ✅ Scaling Example: Shaktish Café

_Your café API handles orders for walk-ins + delivery. Traffic spikes during lunch and dinner._

---

## 1. Vertical Scaling (Scale Up)
**What it means:** Upgrade your single server to be more powerful.  

**Analogy:** Replace your one coffee machine with a giant espresso machine that can make 10x more drinks.  

**Backend Example:**  
- Upgrade Postgres server: 4 cores → 16 cores, 16GB RAM → 64GB RAM  
- Node.js API server: increase CPU and memory to handle more requests  

**Pros:** Simple, no code changes  
**Cons:** Max limit, single point of failure  

**Note:** Good for early-stage cafés with growing traffic but single location  

---

## 2. Horizontal Scaling (Scale Out)
**What it means:** Add more servers to handle load  

**Analogy:** Instead of one giant coffee machine, you hire 4 more baristas with regular machines, all taking orders simultaneously  

**Backend Example:**  
- Run multiple Node.js servers behind a load balancer (NGINX or AWS ELB)  
- Database: add read replicas to handle reporting queries  
- Cache: Redis cluster instead of single instance  

**Pros:** Can scale indefinitely, fault-tolerant  
**Cons:** More complex setup, needs load balancing and distributed DB design  

**Note:** Ideal for popular cafés with multiple outlets or high online orders  

---

## Quick Café Cheat Notes

| Scaling Type     | Café Analogy                 | Backend Analogy                    | Pros                           | Cons                                 |
| ---------------- | ---------------------------- | ---------------------------------- | ------------------------------ | ------------------------------------ |
| Vertical (Up)    | Giant coffee machine         | Bigger DB/API server               | Simple, fast                   | Max limit, single point of failure   |
| Horizontal (Out) | Add more baristas + machines | Multiple API servers + DB replicas | Infinite scale, fault-tolerant | Complex setup, load balancing needed |
