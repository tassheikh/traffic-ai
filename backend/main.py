import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

# STEP 1: Load data
data = pd.read_csv("data/traffic_data.csv")

# STEP 2: Convert text to numbers
data['day'] = data['day'].map({
    'Mon':1, 'Tue':2, 'Wed':3, 'Thu':4, 'Fri':5
})

data['weather'] = data['weather'].map({
    'Clear':0, 'Cloudy':1, 'Rain':2
})

data['traffic'] = data['traffic'].map({
    'Low':0, 'Medium':1, 'High':2
})

# STEP 3: Features & Target
X = data[['day', 'time', 'vehicles', 'weather']]
y = data['traffic']

# STEP 4: Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# STEP 5: Random Forest Model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# STEP 6: Prediction
y_pred = model.predict(X_test)

print("Predictions:", y_pred)
print("Actual:", y_test.values)

# STEP 7: Accuracy
accuracy = accuracy_score(y_test, y_pred)
print("Accuracy:", accuracy)

# STEP 8: Save Model
joblib.dump(model, "models/traffic_model.pkl")
print("Model saved successfully!")

# ------------------ GRAPH SECTION ------------------

# Vehicles vs Time
plt.figure()
sns.lineplot(x=data['time'], y=data['vehicles'])
plt.title("Vehicles vs Time")
plt.xlabel("Time")
plt.ylabel("Number of Vehicles")
plt.show()

# Traffic Distribution
plt.figure()
sns.countplot(x=data['traffic'])
plt.title("Traffic Level Distribution (0=Low,1=Medium,2=High)")
plt.show()

# Weather vs Vehicles
plt.figure()
sns.barplot(x=data['weather'], y=data['vehicles'])
plt.title("Weather vs Vehicles (0=Clear,1=Cloudy,2=Rain)")
plt.show()