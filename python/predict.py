import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# In a real implementation, this would be a trained model
# For demonstration purposes, we'll create a simple model

# Function to generate synthetic lifestyle data
def generate_synthetic_data(n_samples=1000):
    np.random.seed(42)
    
    # Generate features
    age = np.random.randint(18, 80, n_samples)
    gender = np.random.choice(['male', 'female'], n_samples)
    weight = np.random.normal(70, 15, n_samples)  # in kg
    height = np.random.normal(170, 10, n_samples)  # in cm
    
    # Calculate BMI
    bmi = weight / ((height / 100) ** 2)
    
    # Exercise frequency (days per week)
    exercise_frequency = np.random.choice([0, 1, 2, 3, 4, 5, 6, 7], n_samples)
    
    # Exercise types (multiple possible)
    exercise_types_cardio = np.random.choice([0, 1], n_samples)
    exercise_types_strength = np.random.choice([0, 1], n_samples)
    exercise_types_flexibility = np.random.choice([0, 1], n_samples)
    exercise_types_sports = np.random.choice([0, 1], n_samples)
    exercise_types_walking = np.random.choice([0, 1], n_samples)
    
    # Sleep hours
    sleep_hours = np.random.normal(7, 1.5, n_samples)
    sleep_hours = np.clip(sleep_hours, 3, 12)
    
    # Sleep quality
    sleep_quality = np.random.choice(['poor', 'fair', 'average', 'good', 'excellent'], n_samples)
    
    # Diet quality (1-10)
    diet_quality = np.random.randint(1, 11, n_samples)
    
    # Diet type
    diet_type = np.random.choice(['balanced', 'vegetarian', 'vegan', 'keto', 'paleo', 'mediterranean', 'high-protein'], n_samples)
    
    # Water intake
    water_intake = np.random.choice(['low', 'moderate', 'high'], n_samples)
    
    # Stress level (1-10)
    stress_level = np.random.randint(1, 11, n_samples)
    
    # Smoking status
    smoking_status = np.random.choice(['non-smoker', 'former-smoker', 'occasional', 'regular'], n_samples)
    
    # Alcohol consumption
    alcohol_consumption = np.random.choice(['none', 'occasional', 'moderate', 'heavy'], n_samples)
    
    # Mental health indicators
    anxiety_frequency = np.random.choice(['rarely', 'sometimes', 'often', 'constantly'], n_samples)
    depression_frequency = np.random.choice(['rarely', 'sometimes', 'often', 'constantly'], n_samples)
    social_connections = np.random.choice(['limited', 'moderate', 'strong', 'very-strong'], n_samples)
    work_life_balance = np.random.choice(['poor', 'fair', 'moderate', 'good', 'excellent'], n_samples)
    mindfulness_practice = np.random.choice(['never', 'occasionally', 'weekly', 'daily'], n_samples)
    
    # Physical health indicators
    blood_pressure = np.random.choice(['low', 'normal', 'elevated', 'high-stage1', 'high-stage2', 'unknown'], n_samples)
    cholesterol_levels = np.random.choice(['normal', 'borderline', 'high', 'unknown'], n_samples)
    
    # Family history (binary indicators)
    family_heart_disease = np.random.choice([0, 1], n_samples)
    family_diabetes = np.random.choice([0, 1], n_samples)
    family_cancer = np.random.choice([0, 1], n_samples)
    family_hypertension = np.random.choice([0, 1], n_samples)
    family_stroke = np.random.choice([0, 1], n_samples)
    family_mental_health = np.random.choice([0, 1], n_samples)
    
    # Existing conditions (binary indicators)
    condition_diabetes = np.random.choice([0, 1], n_samples)
    condition_hypertension = np.random.choice([0, 1], n_samples)
    condition_heart_disease = np.random.choice([0, 1], n_samples)
    condition_asthma = np.random.choice([0, 1], n_samples)
    condition_arthritis = np.random.choice([0, 1], n_samples)
    condition_thyroid = np.random.choice([0, 1], n_samples)
    condition_anxiety = np.random.choice([0, 1], n_samples)
    condition_depression = np.random.choice([0, 1], n_samples)
    
    # Create DataFrame
    data = pd.DataFrame({
        'age': age,
        'gender': gender,
        'weight': weight,
        'height': height,
        'bmi': bmi,
        'exercise_frequency': exercise_frequency,
        'exercise_types_cardio': exercise_types_cardio,
        'exercise_types_strength': exercise_types_strength,
        'exercise_types_flexibility': exercise_types_flexibility,
        'exercise_types_sports': exercise_types_sports,
        'exercise_types_walking': exercise_types_walking,
        'sleep_hours': sleep_hours,
        'sleep_quality': sleep_quality,
        'diet_quality': diet_quality,
        'diet_type': diet_type,
        'water_intake': water_intake,
        'stress_level': stress_level,
        'smoking_status': smoking_status,
        'alcohol_consumption': alcohol_consumption,
        'anxiety_frequency': anxiety_frequency,
        'depression_frequency': depression_frequency,
        'social_connections': social_connections,
        'work_life_balance': work_life_balance,
        'mindfulness_practice': mindfulness_practice,
        'blood_pressure': blood_pressure,
        'cholesterol_levels': cholesterol_levels,
        'family_heart_disease': family_heart_disease,
        'family_diabetes': family_diabetes,
        'family_cancer': family_cancer,
        'family_hypertension': family_hypertension,
        'family_stroke': family_stroke,
        'family_mental_health': family_mental_health,
        'condition_diabetes': condition_diabetes,
        'condition_hypertension': condition_hypertension,
        'condition_heart_disease': condition_heart_disease,
        'condition_asthma': condition_asthma,
        'condition_arthritis': condition_arthritis,
        'condition_thyroid': condition_thyroid,
        'condition_anxiety': condition_anxiety,
        'condition_depression': condition_depression
    })
    
    # Generate target variables (health risks)
    # These are more comprehensive models incorporating the new variables
    
    # Cardiovascular risk
    cardiovascular_risk = (
        0.20 * age / 80 +
        0.15 * np.clip(bmi - 18.5, 0, 15) / 15 +
        0.15 * (7 - exercise_frequency) / 7 +
        0.10 * (smoking_status == 'regular') +
        0.10 * (alcohol_consumption == 'heavy') +
        0.05 * (blood_pressure == 'high-stage2') +
        0.05 * (blood_pressure == 'high-stage1') +
        0.05 * (cholesterol_levels == 'high') +
        0.05 * family_heart_disease +
        0.05 * family_stroke +
        0.05 * condition_heart_disease
    )
    
    # Metabolic risk
    metabolic_risk = (
        0.25 * np.clip(bmi - 18.5, 0, 15) / 15 +
        0.20 * (10 - diet_quality) / 10 +
        0.15 * (7 - exercise_frequency) / 7 +
        0.10 * (water_intake == 'low') +
        0.10 * (cholesterol_levels == 'high') +
        0.05 * family_diabetes +
        0.05 * condition_diabetes +
        0.05 * (diet_type == 'keto') +
        0.05 * (exercise_types_cardio == 0)
    )
    
    # Sleep quality risk
    sleep_risk = (
        0.25 * (stress_level) / 10 +
        0.20 * (sleep_quality == 'poor') +
        0.15 * abs(sleep_hours - 7.5) / 3.5 +
        0.10 * (alcohol_consumption == 'heavy') +
        0.10 * (anxiety_frequency == 'constantly') +
        0.05 * (depression_frequency == 'constantly') +
        0.05 * (mindfulness_practice == 'never') +
        0.05 * (work_life_balance == 'poor') +
        0.05 * condition_anxiety
    )
    
    # Mental health risk
    mental_risk = (
        0.20 * stress_level / 10 +
        0.15 * (anxiety_frequency == 'constantly') +
        0.15 * (depression_frequency == 'constantly') +
        0.10 * (social_connections == 'limited') +
        0.10 * (work_life_balance == 'poor') +
        0.10 * (mindfulness_practice == 'never') +
        0.05 * (sleep_quality == 'poor') +
        0.05 * (7 - exercise_frequency) / 7 +
        0.05 * family_mental_health +
        0.05 * condition_depression
    )
    
    # Convert to binary classification for simplicity
    # In a real model, these would be more nuanced
    data['cardiovascular_risk'] = (cardiovascular_risk > 0.5).astype(int)
    data['metabolic_risk'] = (metabolic_risk > 0.5).astype(int)
    data['sleep_risk'] = (sleep_risk > 0.5).astype(int)
    data['mental_risk'] = (mental_risk > 0.5).astype(int)
    
    return data

# Generate synthetic data
data = generate_synthetic_data(1000)

# Prepare features and targets
X = data.drop(['cardiovascular_risk', 'metabolic_risk', 'sleep_risk', 'mental_risk'], axis=1)
y_cardio = data['cardiovascular_risk']
y_metabolic = data['metabolic_risk']
y_sleep = data['sleep_risk']
y_mental = data['mental_risk']

# Convert categorical variables to dummy variables
X = pd.get_dummies(X)

# Split data
X_train, X_test, y_cardio_train, y_cardio_test = train_test_split(X, y_cardio, test_size=0.2, random_state=42)
_, _, y_metabolic_train, y_metabolic_test = train_test_split(X, y_metabolic, test_size=0.2, random_state=42)
_, _, y_sleep_train, y_sleep_test = train_test_split(X, y_sleep, test_size=0.2, random_state=42)
_, _, y_mental_train, y_mental_test = train_test_split(X, y_mental, test_size=0.2, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train models
models = {
    'cardiovascular': RandomForestClassifier(n_estimators=100, random_state=42),
    'metabolic': GradientBoostingClassifier(n_estimators=100, random_state=42),
    'sleep': RandomForestClassifier(n_estimators=100, random_state=42),
    'mental': GradientBoostingClassifier(n_estimators=100, random_state=42)
}

# Train each model
models['cardiovascular'].fit(X_train_scaled, y_cardio_train)
models['metabolic'].fit(X_train_scaled, y_metabolic_train)
models['sleep'].fit(X_train_scaled, y_sleep_train)
models['mental'].fit(X_train_scaled, y_mental_train)

# Evaluate models
for name, model in models.items():
    if name == 'cardiovascular':
        y_test = y_cardio_test
    elif name == 'metabolic':
        y_test = y_metabolic_test
    elif name == 'sleep':
        y_test = y_sleep_test
    else:  # mental
        y_test = y_mental_test
    
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"{name.capitalize()} Model Accuracy: {accuracy:.4f}")
    print(classification_report(y_test, y_pred))
    print()

# Function to predict health risks for a new user
def predict_health_risks(user_data):
    """
    Predict health risks based on user data
    This function is enhanced to handle the new physical and mental health inputs
    """
    # Convert to DataFrame
    user_df = pd.DataFrame([user_data])
    
    # Process exercise types if provided
    if 'exerciseTypes' in user_data:
        exercise_types = user_data['exerciseTypes']
        user_df['exercise_types_cardio'] = 1 if 'Cardio' in exercise_types else 0
        user_df['exercise_types_strength'] = 1 if 'Strength Training' in exercise_types else 0
        user_df['exercise_types_flexibility'] = 1 if 'Flexibility/Yoga' in exercise_types else 0
        user_df['exercise_types_sports'] = 1 if 'Sports' in exercise_types else 0
        user_df['exercise_types_walking'] = 1 if 'Walking' in exercise_types else 0
    
    # Process family history if provided
    if 'familyHistory' in user_data:
        family_history = user_data['familyHistory']
        user_df['family_heart_disease'] = 1 if 'Heart Disease' in family_history else 0
        user_df['family_diabetes'] = 1 if 'Diabetes' in family_history else 0
        user_df['family_cancer'] = 1 if 'Cancer' in family_history else 0
        user_df['family_hypertension'] = 1 if 'High Blood Pressure' in family_history else 0
        user_df['family_stroke'] = 1 if 'Stroke' in family_history else 0
        user_df['family_mental_health'] = 1 if 'Mental Health Conditions' in family_history else 0
    
    # Process existing conditions if provided
    if 'existingConditions' in user_data:
        conditions = user_data['existingConditions']
        user_df['condition_diabetes'] = 1 if 'Diabetes' in conditions else 0
        user_df['condition_hypertension'] = 1 if 'Hypertension' in conditions else 0
        user_df['condition_heart_disease'] = 1 if 'Heart Disease' in conditions else 0
        user_df['condition_asthma'] = 1 if 'Asthma' in conditions else 0
        user_df['condition_arthritis'] = 1 if 'Arthritis' in conditions else 0
        user_df['condition_thyroid'] = 1 if 'Thyroid Disorder' in conditions else 0
        user_df['condition_anxiety'] = 1 if 'Anxiety Disorder' in conditions else 0
        user_df['condition_depression'] = 1 if 'Depression' in conditions else 0
    
    # Convert categorical variables
    user_df = pd.get_dummies(user_df)
    
    # Ensure all columns from training are present
    for col in X.columns:
        if col not in user_df.columns:
            user_df[col] = 0
    
    # Keep only columns used during training
    user_df = user_df[X.columns]
    
    # Scale features
    user_scaled = scaler.transform(user_df)
    
    # Make predictions
    predictions = {}
    for name, model in models.items():
        # Get probability of high risk (class 1)
        prob = model.predict_proba(user_scaled)[0][1]
        risk_percentage = int(prob * 100)
        
        # Get feature importances for this model
        importances = model.feature_importances_
        feature_importance = dict(zip(X.columns, importances))
        
        # Sort features by importance
        sorted_features = sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)
        top_features = sorted_features[:8]  # Get more features to generate more recommendations
        
        # Generate recommendations based on top features and new inputs
        recommendations = []
        
        # Cardiovascular recommendations
        if name == 'cardiovascular':
            if any(f for f, _ in top_features if 'exercise' in f):
                if user_data.get('exerciseFrequency', '') in ['sedentary', 'light'] or user_data.get('exercise_frequency', 0) < 3:
                    recommendations.append({
                        "name": "Exercise",
                        "impact": "High negative impact",
                        "suggestion": "Aim for at least 150 minutes of moderate aerobic activity weekly"
                    })
                else:
                    recommendations.append({
                        "name": "Exercise",
                        "impact": "High positive impact",
                        "suggestion": "Continue your regular exercise routine"
                    })
            
            if any(f for f, _ in top_features if 'blood_pressure' in f):
                if user_data.get('bloodPressure', '') in ['high-stage1', 'high-stage2']:
                    recommendations.append({
                        "name": "Blood Pressure",
                        "impact": "High negative impact",
                        "suggestion": "Consult with a healthcare provider about managing your blood pressure"
                    })
                else:
                    recommendations.append({
                        "name": "Blood Pressure",
                        "impact": "Low positive impact",
                        "suggestion": "Continue monitoring your blood pressure regularly"
                    })
            
            if any(f for f, _ in top_features if 'family' in f and ('heart' in f or 'stroke' in f)):
                recommendations.append({
                    "name": "Family History",
                    "impact": "Medium negative impact",
                    "suggestion": "Given your family history, regular cardiovascular checkups are recommended"
                })
        
        # Metabolic recommendations
        elif name == 'metabolic':
            if any(f for f, _ in top_features if 'diet' in f):
                if user_data.get('dietType', '') in ['balanced', 'mediterranean']:
                    recommendations.append({
                        "name": "Diet",
                        "impact": "High positive impact",
                        "suggestion": "Your diet choice is beneficial for metabolic health"
                    })
                else:
                    recommendations.append({
                        "name": "Diet",
                        "impact": "Medium negative impact",
                        "suggestion": "Consider a more balanced diet with less processed foods"
                    })
            
            if any(f for f, _ in top_features if 'water' in f):
                if user_data.get('waterIntake', '') == 'low':
                    recommendations.append({
                        "name": "Hydration",
                        "impact": "Medium negative impact",
                        "suggestion": "Increase water intake to at least 8 glasses daily"
                    })
                else:
                    recommendations.append({
                        "name": "Hydration",
                        "impact": "Medium positive impact",
                        "suggestion": "Continue with good hydration habits"
                    })
            
            if any(f for f, _ in top_features if 'cholesterol' in f):
                if user_data.get('cholesterolLevels', '') in ['high', 'borderline']:
                    recommendations.append({
                        "name": "Cholesterol",
                        "impact": "Medium negative impact",
                        "suggestion": "Consider dietary changes to improve cholesterol levels"
                    })
                else:
                    recommendations.append({
                        "name": "Cholesterol",
                        "impact": "Low positive impact",
                        "suggestion": "Maintain your healthy cholesterol levels"
                    })
        
        # Sleep recommendations
        elif name == 'sleep':
            if any(f for f, _ in top_features if 'sleep_quality' in f):
                if user_data.get('sleepQuality', '') in ['poor', 'fair']:
                    recommendations.append({
                        "name": "Sleep Environment",
                        "impact": "High negative impact",
                        "suggestion": "Create a dark, quiet, and cool sleeping environment"
                    })
                else:
                    recommendations.append({
                        "name": "Sleep Environment",
                        "impact": "Medium positive impact",
                        "suggestion": "Maintain your comfortable sleep environment"
                    })
            
            if any(f for f, _ in top_features if 'stress' in f or 'anxiety' in f):
                if user_data.get('stressLevel', 0) > 6 or user_data.get('anxietyFrequency', '') in ['often', 'constantly']:
                    recommendations.append({
                        "name": "Stress Management",
                        "impact": "High negative impact",
                        "suggestion": "Try meditation or deep breathing before sleep"
                    })
                else:
                    recommendations.append({
                        "name": "Stress Management",
                        "impact": "Medium positive impact",
                        "suggestion": "Continue your effective stress management techniques"
                    })
            
            if any(f for f, _ in top_features if 'sleep_hours' in f):
                sleep_hours = user_data.get('sleepHours', 7)
                if sleep_hours < 6 or sleep_hours > 9:
                    recommendations.append({
                        "name": "Sleep Duration",
                        "impact": "Medium negative impact",
                        "suggestion": f"Aim for 7-8 hours of sleep instead of your current {sleep_hours} hours"
                    })
                else:
                    recommendations.append({
                        "name": "Sleep Duration",
                        "impact": "Medium positive impact",
                        "suggestion": "Your sleep duration is in the optimal range"
                    })
        
        # Mental health recommendations
        elif name == 'mental':
            if any(f for f, _ in top_features if 'social' in f):
                if user_data.get('socialConnections', '') in ['limited', 'moderate']:
                    recommendations.append({
                        "name": "Social Connection",
                        "impact": "Medium negative impact",
                        "suggestion": "Try to increase meaningful social interactions weekly"
                    })
                else:
                    recommendations.append({
                        "name": "Social Connection",
                        "impact": "High positive impact",
                        "suggestion": "Continue maintaining your strong social connections"
                    })
            
            if any(f for f, _ in top_features if 'mindfulness' in f):
                if user_data.get('mindfulnessPractice', '') in ['never', 'occasionally']:
                    recommendations.append({
                        "name": "Mindfulness",
                        "impact": "Medium negative impact",
                        "suggestion": "Consider adding daily mindfulness practice to your routine"
                    })
                else:
                    recommendations.append({
                        "name": "Mindfulness",
                        "impact": "High positive impact",
                        "suggestion": "Continue your regular mindfulness practice"
                    })
            
            if any(f for f, _ in top_features if 'work_life' in f):
                if user_data.get('workLifeBalance', '') in ['poor', 'fair']:
                    recommendations.append({
                        "name": "Work-Life Balance",
                        "impact": "High negative impact",
                        "suggestion": "Set clear boundaries between work and personal time"
                    })
                else:
                    recommendations.append({
                        "name": "Work-Life Balance",
                        "impact": "Medium positive impact",
                        "suggestion": "Your balance is good; continue prioritizing personal time"
                    })
        
        # Add generic recommendations if we don't have enough specific ones
        if len(recommendations) < 5:
            if name == 'cardiovascular' and not any(r["name"] == "Diet" for r in recommendations):
                recommendations.append({
                    "name": "Diet",
                    "impact": "Medium impact",
                    "suggestion": "A diet low in sodium and saturated fat is beneficial for heart health"
                })
            
            if name == 'metabolic' and not any(r["name"] == "Exercise" for r in recommendations):
                recommendations.append({
                    "name": "Exercise",
                    "impact": "Medium impact",
                    "suggestion": "Regular physical activity improves metabolic health"
                })
            
            if name == 'sleep' and not any(r["name"] == "Evening Routine" for r in recommendations):
                recommendations.append({
                    "name": "Evening Routine",
                    "impact": "Medium impact",
                    "suggestion": "Establish a consistent pre-sleep routine to improve sleep quality"
                })
            
            if name == 'mental' and not any(r["name"] == "Physical Activity" for r in recommendations):
                recommendations.append({
                    "name": "Physical Activity",
                    "impact": "Medium impact",
                    "suggestion": "Regular exercise can significantly improve mood and reduce anxiety"
                })
        
        # Limit to top 5 recommendations
        recommendations = recommendations[:5]
        
        predictions[name] = {
            "risk": risk_percentage,
            "factors": recommendations
        }
    
    return predictions

# Example usage
example_user = {
    'age': 45,
    'gender': 'male',
    'weight': 85,
    'height': 175,
    'bmi': 85 / ((175 / 100) ** 2),
    'exercise_frequency': 2,
    'sleep_hours': 6,
    'diet_quality': 6,
    'stress_level': 7,
    'smoking_status': 'former-smoker',
    'alcohol_consumption': 'moderate'
}

# Get predictions
predictions = predict_health_risks(example_user)
print("Health Risk Predictions:")
for category, result in predictions.items():
    print(f"\n{category.capitalize()} Risk: {result['risk']}%")
    print("Key Factors:")
    for factor in result['factors']:
        print(f"  - {factor['name']}: {factor['impact']}")
        print(f"    Suggestion: {factor['suggestion']}")

# Example Flask API to serve the model
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/predict', methods=['POST'])
def api_predict():
    try:
        # Get data from request
        user_data = request.json
        
        # Calculate BMI if not provided
        if 'bmi' not in user_data and 'weight' in user_data and 'height' in user_data:
            user_data['bmi'] = user_data['weight'] / ((user_data['height'] / 100) ** 2)
        
        # Make predictions
        predictions = predict_health_risks(user_data)
        
        return jsonify(predictions)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Run the Flask app when executed directly
if __name__ == '__main__':
    app.run(debug=True)
