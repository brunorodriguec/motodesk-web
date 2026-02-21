# motodesk-web
**MotoDesk** is a Micro-SaaS designed to automate the initial triage for motorcycle workshops. It uses Artificial Intelligence to chat with customers, validate schedules, and organize service orders automatically.

##  Features
- **AI Triage:** Powered by **Gemini 3**, the assistant handles customer inquiries and collects essential data (Name, Bike Model, License Plate).
- **Smart Scheduling:** Real-time validation of available hours to avoid overbooking.
- **Admin Dashboard:** A full Management Panel for workshop owners to track tickets in real-time (CRUD).
- **Dark Mode UI:** Professional and responsive interface built with **Tailwind CSS**.

## Tech Stack
- **Framework:** Next.js 14
- **AI Engine:** Google Gemini 3 API
- **Database:** Firebase Firestore (Real-time updates)
- **Styling:** Tailwind CSS

##  How it works
1. The customer describes the problem or requests a service in the chat.
2. The AI identifies the service and checks the workshop's availability.
3. Once confirmed, the data is sent to a **Firestore** database.
4. The workshop manager views and updates the ticket status (Pending -> In Progress -> Done) in the Admin panel.

---
Developed as part of my **Systems Analysis and Development (ADS)** studies. 
Focusing on **Continuous Improvement** and **Operational Efficiency**.
