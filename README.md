# SwasthyaSaathi (स्वास्थ्यसाथी)
> **Reliable Health Guidance. Even Offline.**  
> Frontline AI & Protocol Companion for ASHA and ANM Healthcare Workers

---

## 1. Project Overview & Clinical Mission
**SwasthyaSaathi** is an offline-first clinical decision-support and household visit planning companion engineered specifically for frontline health workers (ASHA — Accredited Social Health Activists and ANM — Auxiliary Nurse Midwives) serving remote, rural, and low-connectivity communities across India.

### Core Safety Statement
> **CRITICAL CLINICAL BOUNDARY**: SwasthyaSaathi is a protocol-reference, triage-escalation, and field-planning tool, **NOT** an autonomous diagnostic system and **NOT** a replacement for a qualified Medical Officer.

---

## 2. Five Mandatory Core Outcomes (Problem Statement Checklist)
1. **Protocol-Grounded Question Answering**: Grounded strictly in locally stored, approved public-health guidelines (MoHFW / NHM / WHO-AIIMS). Every substantive answer contains document title, section reference, page number, and verification hash.
2. **Genuine Offline Operation**: Full-text tokenized inverted search, danger-sign checking, evidence verification, grounded extraction, and daily visit planning work with zero network connectivity.
3. **Deterministic Danger-Sign Escalation Engine**: Executes **BEFORE** any AI model or generative reasoning. Immediately displays high-contrast red emergency referral screen (`"IMMEDIATE REFERRAL — DO NOT DELAY"`) and stops normal answer generation.
4. **Daily Household Visit Planner (500 Families)**: Deterministically generated register of exactly 500 synthetic households calculating due services, overdue follow-ups, and transparent rule-based priority reasons entirely from local client storage.
5. **Safe Refusal for Unsupported Questions**: Out-of-scope or unsupported queries trigger safe refusal:
   *"I could not find sufficient supporting evidence in the available approved protocols. Please consult your supervisor or an appropriate qualified healthcare professional."*

---

## 3. Four-Tier Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                            USER INQUIRY / FIELD QUERY                             |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| TIER 1: DETERMINISTIC DANGER-SIGN ESCALATION ENGINE (Priority 1 - Safety First)   |
| • Text Normalization (strip punctuation, lowercase, collapse whitespace)          |
| • Version-controlled clinical emergency rules registry                           |
| • Exact phrase & code-mixed (Hinglish/Telugu) alias matching                      |
| • Zero-network / Zero-AI deterministic evaluation                                 |
+-----------------------------------------------------------------------------------+
                  |                                              |
      [MATCHED DANGER SIGN]                             [NO DANGER SIGN]
                  |                                              |
                  v                                              v
+------------------------------------+        +-------------------------------------+
| IMMEDIATE EMERGENCY REFERRAL       |        | TIER 2: LOCAL OFFLINE SEARCH &      |
| • Red Screen: DO NOT DELAY         |        |         EVIDENCE SUFFICIENCY GATE   |
| • 108 / 102 Ambulance Dispatch     |        | • Tokenized inverted index          |
| • Stabilization SOP (KMC, Lateral) |        | • 10 Approved NHM/MoHFW Protocols   |
| • MoHFW Guideline Citation         |        | • Relevance scoring & overlap check |
| • Normal AI Generation HALTED      |        +-------------------------------------+
+------------------------------------+                           |
                                                     [EVALUATE RELEVANCE]
                                                /                            \
                                     [INSUFFICIENT EVIDENCE]          [SUFFICIENT EVIDENCE]
                                              |                                 |
                                              v                                 v
                               +-----------------------------+   +-----------------------------+
                               | SAFE CLINICAL REFUSAL       |   | TIER 3: OFFLINE GROUNDED    |
                               | Refusal notice with Medical |   |         SYNTHESIS ENGINE    |
                               | Officer consultation advice |   | • Verifiable Citations      |
                               +-----------------------------+   | • Title, Section, Page No.  |
                                                                 | • Frontline Scope Actions   |
                                                                 | • Clinical Disclaimer       |
                                                                 +-----------------------------+

+-----------------------------------------------------------------------------------+
| TIER 4: 500-HOUSEHOLD FIELD REGISTER & DAILY VISIT PLANNER (Priority 4)           |
| • Exact 500 deterministic synthetic families seeded in browser storage            |
| • Due Today, Overdue, and Priority (Urgent / High / Normal) calculations          |
| • Offline visit completion, timestamped notes, and consent-based sync queue       |
+-----------------------------------------------------------------------------------+
```

---

## 4. Approved Protocol Corpus (10 Comprehensive National Guidelines)
The application indexes 10 official public health protocols:
1. `NHM-ANC-2023`: Schedule of 4 Mandatory Antenatal Checkups (p. 14) & IFA/Calcium/Deworming (p. 22).
2. `MOHFW-HRP-2022`: High-Risk Pregnancy & Maternal Danger Signs (p. 28).
3. `NHM-HBNC-2023`: Home Based Newborn Care Home Visit Schedule & Danger Signs Checklist (p. 45).
4. `UIP-NIS-2023`: National Immunization Schedule (NIS) Timetable (p. 8).
5. `MOHFW-SAM-2022`: Community Screening Criteria for SAM and MAM (MUAC & Edema) (p. 19).
6. `NP-NCD-HTN-2023`: Community Follow-up & Medication Adherence for Hypertension (p. 32).
7. `NP-NCD-DIAB-2023`: Community Monitoring, Hypoglycemia Rule of 15 & Diabetic Foot Care (p. 41).
8. `MOHFW-CDD-2023`: Home Management of Diarrhea, Low-Osmolarity ORS & 14-day Zinc (p. 11).
9. `NVBDCP-FEVER-2023`: Community Fever Screening, Malaria RDT & Safe Antipyretic Guidance (p. 23).
10. `NHM-REF-SOP-2023`: Standard Operating Procedures for Emergency Referral & Transport (p. 5).

---

## 5. Hackathon Evaluator Quick-Demo Guide
A top-mounted **Hackathon Evaluator Quick-Demo Bar** provides 1-click execution of the 5 core outcomes:
- **Button 1 (Normal Question)**: Retrieves 4 mandatory ANC checkups with source citation and page number.
- **Button 2 (Emergency Escalation)**: Triggers severe pregnancy bleeding emergency; halts AI and displays the red referral screen.
- **Button 3 (Safe Refusal)**: Queries stock market investment; safely refuses due to lack of approved protocol evidence.
- **Button 4 (Today's Urgent Visits)**: Jumps to Visit Planner with the `URGENT` filter active across 500 households.
- **Button 5 (Escalation Suite 100%)**: Executes all positive and negative clinical danger-sign test cases with 100% detection rate.
- **Button 6 (Offline Diagnostics)**: Runs client-side CPU benchmark (median and p95 latency) and verifies Cache API storage.

---

## 6. Offline Testing Procedure
1. Load SwasthyaSaathi in the browser while connected.
2. Confirm the 500 households and 10 protocols are initialized.
3. Click **"Simulate Airplane Mode"** in the top navigation bar (or disconnect device Wi-Fi).
4. Notice the floating amber banner: *"Airplane Mode Simulation Active — 100% Offline"*.
5. Search protocols for *"ORS preparation"* or *"Pentavalent vaccine"* — executes with zero network requests.
6. Open the Daily Visit Planner, select a household, add a field note, and mark the visit completed.
7. Refresh the browser page: verify that the updated visit status and notes persist in local storage.
8. Open the Escalation Test Centre and run the full 20-case test suite offline.

---

## 7. Known Limitations & Production-Readiness Checklist
- [x] Responsive layout optimized for mobile and low-end Android devices.
- [x] Application shell precached via VitePWA and Service Worker.
- [x] Deterministic danger-sign engine intercepts input prior to any AI model inference.
- [x] 100% detection target achieved on mandatory emergency test suite.
- [x] All 500 synthetic families generated deterministically and stored locally.
- [x] Verifiable citations with document title, section heading, page number, and hash.
- [x] Safe refusal for out-of-scope inquiries.
- [x] Client CPU benchmark provides real median and p95 response latencies.
- [x] Multilingual interface (English, Hindi, Telugu).
- [ ] *Production Deployment Note*: While the client-side architecture is fully offline-capable, production rollout requires formal clinical validation by state health directorates and MDM (Mobile Device Management) provisioning on government-issued ASHA tablets.
