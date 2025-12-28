# ✨ Zenith Suites  
## Smart Hotel Management & Robotic Service Platform

> **Zenith Suites** is a next-generation smart hotel system that seamlessly integrates  
> **web technologies, robotic services, secure identity verification, and rule-based intelligence**  
> to deliver a futuristic, efficient, and human-centered hospitality experience.

---

## 🌍 Vision

The hospitality industry is rapidly transforming with automation, robotics, and intelligent systems.  
Zenith Suites was designed to **redefine boutique hotel operations** by combining:

- Luxury-focused guest experience  
- Autonomous robotic services  
- Secure digital identity workflows  
- Explainable, rule-based decision systems  

Rather than replacing human interaction, the system **augments hotel staff** by automating repetitive tasks and enabling more personalized service.

---

## 🚀 Highlights

### 🛎️ Smart Reservation & Booking
- Online room booking with real-time availability  
- Capacity, date, and preference-based constraints  
- Secure payment flow  
- Automated confirmation emails  

### 🤖 Robotic Check-in & Guest Services
- Robot-assisted check-in and key delivery  
- Optional robotic bellboy for luggage transport and room escort  
- Autonomous service execution triggered by backend events  
- Centralized robot control through backend APIs  

### 🧠 Rule-Based Room Recommendation
- Deterministic, constraint-based recommendation engine  
- Uses explicit user inputs such as:
  - Budget range  
  - Number of guests  
  - Stay duration  
  - Room amenities (jacuzzi, infinity pool, sea view, etc.)  
- Fully explainable logic (no black-box behavior)  
- Eliminates cold-start problem  

### 🔐 Identity Verification
- Facial image upload during reservation  
- Face verification during check-in  
- Secure biometric data handling  
- Unauthorized access prevention  

### 🌐 Web-Based Guest Interaction
- Modern, responsive UI (desktop & mobile)  
- Online check-in and service requests  
- Real-time updates between web interface and robotic systems  

---

## 🛠️ Technology Stack

### Backend
- **ASP.NET Core** – RESTful API development  
- **SignalR** – Real-time communication (Web ↔ Robot)  
- **PostgreSQL** – Relational data storage  
- **JWT** – Secure authentication  

### Frontend
- **React**  
- **HTML / CSS / JavaScript**  

### Robotics & Automation
- Backend-driven robotic task orchestration  
- Facial verification integration  
- Autonomous service execution  

---

## 📊 Recommendation Logic (Conceptual)

The room recommendation engine follows a **rule-based scoring approach**:

1. Filter rooms by availability and capacity  
2. Apply budget constraints  
3. Score rooms based on preference matching  
4. Rank and return explainable recommendations  

This approach ensures:
- Predictable system behavior  
- Transparency for users  
- Robust performance in low-data environments  

---

## 🧪 Testing & Validation

- API endpoints tested via Postman  
- Reservation and check-in flows tested with real scenarios  
- Recommendation rules validated against edge cases  
- Integration testing between backend and robotic layer  

---

## 📈 Outcomes

- End-to-end smart hotel management platform  
- Real-time robot-assisted guest services  
- Secure identity verification workflow  
- Explainable recommendation system  
- Scalable and extensible backend architecture  

---

## 🔮 Future Roadmap

- Machine learning–based recommendation enhancement  
- Mobile application support  
- Hotel management analytics dashboard  
- Multi-robot coordination & scheduling  
- External booking platform integrations  

---

## 👩‍💻 Team

This project was developed as a **Computer & Electrical Engineering capstone project**.

**Contributors**
- İrem Dinç  
- Rana Kara
- Elif Deniz Gölboyu  
- Emre Harmandal  
- Atahan Doruk Yılmaz 

---

## 📍 Project Status

🟢 Active Development  
🎓 Academic Capstone Project


## 🧩 System Architecture

Zenith Suites is built using a **modular, layered architecture** to ensure scalability, clarity, and maintainability.

```mermaid
flowchart TD
    Web["Web Frontend - React"]
    Api["Backend APIs - .NET Core"]
    Db[(PostgreSQL Database)]
    Robot["Robotic Integration"]

    Web --> Api
    Api --> Db
    Db --> Robot


