# NutriCalc — Nutrition Assessment & Nutritional Calculation System

> **NutriCalc** is a clinical nutrition assessment and metabolic calculation web application designed for clinical nutritionists, dietitians, multidisciplinary hospital teams, and medical researchers.

---

## 🌟 Key Capabilities

1. **Patient Registration & Anthropometry Management**:
   - Collects validated clinical parameters (Name, Weight in kg, Height in cm, Age, Gender, IP Number, District, State, Pincode).
   - Global reactive state ensures data is never lost during navigation between assessment and formula workflows.

2. **Standardized Malnutrition Assessment Instruments**:
   - **GLIM (Global Leadership Initiative on Malnutrition)**: 2-step diagnostic framework integrating Phenotypic criteria (Weight loss %, Low BMI by age/Asian threshold, Reduced muscle mass by validated clinical methods) and Etiologic criteria (Reduced intake/GI conditions, Acute/Chronic disease burden + inflammation).
   - **SGA (Subjective Global Assessment)**: Comprehensive qualitative clinical assessment evaluating Medical History (6-month/2-week weight dynamics, Dietary intake, GI symptoms, Functional capacity) and Physical Examination (Fat loss in 3 sites, Muscle wasting in 8 anatomical sites, Oedema, Ascites) with overall clinical `SGA-A`, `SGA-B`, or `SGA-C` classification.
   - **MNA® (Mini Nutritional Assessment Short-Form)**: Validated 14-point screening protocol for adult and geriatric populations with strict mutual exclusivity between **F1 (BMI)** and **F2 (Calf Circumference fallback)**.
   - **MUST (Malnutrition Universal Screening Tool)**: 5-step screening protocol calculating BMI score, Unplanned weight loss score, and Acute disease effect score with care management guidelines across Hospital, Care Home, and Community healthcare settings.

3. **Nutritional & Metabolic Formulas Engine**:
   - **BMI**: $\text{Weight (kg)} / (\text{Height in meters})^2$
   - **IBW (Ideal Body Weight)**: $\text{Height (cm)} - 100$
   - **ABW (Adjusted Body Weight)**: $\text{IBW} + (0.4 \times (\text{Actual Weight} - \text{IBW}))$
   - **BMR (Basal Metabolic Rate)**:
     - **Male**: $10 \times \text{Weight} + 6.5 \times \text{Height} - 5 \times \text{Age} + 5$
     - **Female**: $10 \times \text{Weight} + 6.5 \times \text{Height} - 5 \times \text{Age} - 161$
   - **TEE (Total Energy Expenditure)**:
     $$\text{TEE} = \text{BMR} \times \text{Physical Activity Factor} \times \text{Injury Factor}$$

4. **Physical Activity & Injury Factor Handling**:
   - **Gender-Tuned Physical Activity Factors**: Sedentary (1.00/1.00), Low Activity (1.11/1.12), Active (1.25/1.27), Very Active (1.48/1.45), Resting (1.10), Confined to Bed (1.20), Out of Bed (1.30).
   - **Clinical Injury / Stress Factors**: General and Specific condition factors with exact range validation (e.g., Sepsis 1.2–1.6, Trauma 1.1–1.8, Burn 1.5–1.9, Ventilator 1.6, COPD Malnourished 1.3, Cancer 1.0–1.5, etc.). Allows the clinician to fine-tune factors within permissible ranges.

5. **MongoDB Atlas Integration**:
   - Persistent storage of complete patient records, raw assessment responses, intermediate formula calculations, and audit trails.
   - In-memory development fallback if MongoDB Atlas credentials are not immediately configured.

6. **Medical Research & Auditing Features**:
   - Full formula transparency with step-by-step mathematical breakdowns.
   - PDF export and clinical print-ready reporting.
   - Search, filter, and sorting across patient records.

---

## 🏗️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, React Router v6, Tailwind CSS, Lucide Icons, Vite |
| **Backend** | Node.js, Express.js REST API |
| **Database** | MongoDB Atlas with Mongoose ODM (with in-memory development fallback) |
| **Architecture** | Component-Driven UI, Modular Service Layer, Pure Calculation Engines |

---

## 📁 Project Structure

```
draft/
├── package.json                    # Root scripts for concurrently running client and server
├── .env.example                    # Global environment variables template
├── README.md                       # Comprehensive documentation
├── server/                         # Express Backend
│   ├── package.json
│   ├── server.js                   # Server entry point & API route mounting
│   ├── .env.example                # Server environment template
│   ├── config/
│   │   └── db.js                   # MongoDB Atlas connection with graceful fallback
│   ├── models/
│   │   └── PatientRecord.js        # Mongoose patient schema & indexes
│   ├── controllers/
│   │   └── patientController.js    # CRUD, search, filter, stats, and evaluations
│   ├── services/
│   │   ├── calculationEngine.js    # Pure mathematical formula engine
│   │   └── assessmentEvaluators.js # GLIM, SGA, MNA, and MUST evaluators
│   ├── routes/
│   │   └── patientRoutes.js        # REST API endpoints
│   ├── middleware/
│   │   ├── validator.js            # Express request validation
│   │   └── errorHandler.js         # Centralized error handler
│   └── scripts/
│       └── seed.js                 # Sample clinical dataset seeder
│
└── client/                         # React Frontend
    ├── package.json
    ├── vite.config.js              # Vite configuration with /api proxy
    ├── tailwind.config.js          # Tailwind styling setup
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx                 # Route navigation & context providers
        ├── index.css               # Clinical theme styling & print media styles
        ├── context/
        │   ├── AssessmentContext.jsx # Global persistent state across workflow
        │   └── ToastContext.jsx      # Alert notifications
        ├── data/
        │   ├── activityFactors.js  # Physical activity factor datasets
        │   ├── injuryFactors.js    # Injury conditions & range definitions
        │   └── clinicalGuidelines.js # Clinical guidelines & criteria metadata
        ├── services/
        │   ├── api.js              # Backend REST API connector
        │   ├── calculationEngine.js # Client-side reactive calculation mirror
        │   └── assessmentEvaluators.js # Client-side assessment evaluator mirror
        ├── components/
        │   ├── Navbar.jsx          # Top navigation with Atlas status badge
        │   ├── Footer.jsx          # Clinical decision support disclaimer
        │   ├── Stepper.jsx         # Assessment workflow progress indicator
        │   ├── FormulaCard.jsx     # Transparent step-by-step formula cards
        │   ├── ClinicalBadge.jsx   # Color + text accessible risk badges
        │   └── ConfirmModal.jsx    # Accessible modal for record deletion
        └── pages/
            ├── Dashboard.jsx       # Real-time KPIs, statistics, and recent records
            ├── PatientRegistration.jsx # Patient input with anthropometry & dual choice
            ├── ToolSelection.jsx   # GLIM, SGA, MNA, MUST selection cards
            ├── GLIMAssessment.jsx  # GLIM phenotypic/etiologic criteria form
            ├── SGAAssessment.jsx   # SGA history & physical exam form
            ├── MNAAssessment.jsx   # MNA 14-point questionnaire & F1/F2 fallback
            ├── MUSTAssessment.jsx  # MUST 5-step wizard
            ├── ScreeningResult.jsx # Intermediate assessment findings breakdown
            ├── FormulasPage.jsx    # Formula calculator with activity & injury sliders
            ├── FinalResult.jsx     # Master clinical assessment report & MongoDB save
            ├── PatientRecords.jsx  # Patient history registry with search & filter
            ├── PatientDetailModal.jsx # Full inspection modal with raw response view
            └── About.jsx           # Clinical guidelines, formulas & research notes
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ or v20+ / v24+ LTS
- **npm**: v9+ or v10+ / v11+
- **MongoDB Atlas Cluster** (Optional: the app includes a fallback in-memory store for local testing).

---

### 1. Installation

From the project root:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

### 2. Configure MongoDB Atlas Environment Variables

1. In the `server` folder, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `server/.env` and insert your MongoDB Atlas connection string:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/nutricalc?retryWrites=true&w=majority&appName=NutriCalcCluster
   CLIENT_ORIGIN=http://localhost:5173
   ```

---

### 3. (Optional) Seed Sample Clinical Test Data

To populate your database with sample patient assessments:

```bash
cd server
npm run seed
```

---

### 4. Running the Application

You can start both frontend and backend concurrently from the root directory:

```bash
npm run dev
```

Or run them in separate terminals:

**Terminal 1 (Backend API):**
```bash
cd server
npm run dev
```
*Server starts on `http://localhost:5000`*

**Terminal 2 (React Frontend):**
```bash
cd client
npm run dev
```
*Client starts on `http://localhost:5173`*

---

## 🧮 Calculation Verification Example

### Patient Profile:
- **Gender**: Male
- **Age**: 30 years
- **Weight**: 70 kg
- **Height**: 170 cm
- **Activity**: Active (Male factor = 1.25)
- **Injury Condition**: Ventilator (Fixed factor = 1.60)

### Calculations:
1. **BMI**:
   $$\text{BMI} = \frac{70}{(1.70)^2} = \mathbf{24.22\text{ kg/m}^2}$$
2. **IBW**:
   $$\text{IBW} = 170 - 100 = \mathbf{70.00\text{ kg}}$$
3. **ABW**:
   $$\text{ABW} = 70 + (0.4 \times (70 - 70)) = \mathbf{70.00\text{ kg}}$$
4. **BMR**:
   $$\text{BMR} = 10(70) + 6.5(170) - 5(30) + 5 = 700 + 1105 - 150 + 5 = \mathbf{1660\text{ kcal/day}}$$
5. **TEE**:
   $$\text{TEE} = 1660 \times 1.25 \times 1.60 = \mathbf{3320\text{ kcal/day}}$$

---

## 📋 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status check |
| `GET` | `/api/patients/stats/dashboard` | Aggregated dashboard statistics |
| `POST` | `/api/patients` | Create & save complete patient record |
| `GET` | `/api/patients` | Query patient registry (search, filter, pagination) |
| `GET` | `/api/patients/:id` | Fetch patient record by ID with audit trail |
| `PUT` | `/api/patients/:id` | Update patient record & recompute metrics |
| `DELETE` | `/api/patients/:id` | Delete patient record |
| `POST` | `/api/evaluate-screening` | Standalone assessment scoring endpoint |
| `POST` | `/api/calculate-formulas` | Standalone nutritional formula calculation endpoint |

---

## 🛡️ Medical Research & Safety Disclaimer

NutriCalc is intended for use by qualified clinical dietitians, nutritionists, and researchers as a decision-support and calculation platform. Final clinical determinations should always incorporate comprehensive patient history, clinical judgment, and institutional protocols.
