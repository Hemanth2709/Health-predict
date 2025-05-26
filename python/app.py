from flask import Flask, request, jsonify, render_template
import pandas as pd
import numpy as np
import pickle
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# In a real application, we would load pre-trained models
# For demonstration, we'll use a mock prediction function
def mock_predict_health_risks(user_data):
    """
    Mock function to simulate model predictions with enhanced inputs
    In a real app, this would use trained models
    """
    # Extract user data
    age = user_data.get('age', 30)
    bmi = user_data.get('bmi', 25)
    if not bmi and 'weight' in user_data and 'height' in user_data:
        weight = user_data.get('weight', 70)
        height = user_data.get('height', 170)
        bmi = weight / ((height / 100) ** 2)
    
    # Exercise data
    exercise_freq = user_data.get('exerciseFrequency', 3)
    if isinstance(exercise_freq, str):
        exercise_map = {
            'sedentary': 0,
            'light': 2,
            'moderate': 4,
            'active': 6,
            'very-active': 7
        }
        exercise_freq = exercise_map.get(exercise_freq, 3)
    
    exercise_types = user_data.get('exerciseTypes', [])
    has_cardio = 'Cardio' in exercise_types
    has_strength = 'Strength Training' in exercise_types
    
    # Sleep data
    sleep_hours = user_data.get('sleepHours', 7)
    sleep_quality = user_data.get('sleepQuality', 'average')
    sleep_quality_score = {
        'poor': 2,
        'fair': 4,
        'average': 6,
        'good': 8,
        'excellent': 10
    }.get(sleep_quality, 6)
    
    # Diet data
    diet_quality = user_data.get('diet_quality', 5)
    if 'dietType' in user_data:
        diet_map = {
            'balanced': 7,
            'vegetarian': 8,
            'vegan': 8,
            'keto': 6,
            'paleo': 6,
            'mediterranean': 9,
            'high-protein': 7
        }
        diet_quality = diet_map.get(user_data['dietType'], 5)
    
    water_intake = user_data.get('waterIntake', 'moderate')
    water_score = {
        'low': 3,
        'moderate': 7,
        'high': 10
    }.get(water_intake, 7)
    
    # Mental health data
    stress_level = user_data.get('stressLevel', 5)
    
    anxiety_freq = user_data.get('anxietyFrequency', 'sometimes')
    anxiety_score = {
        'rarely': 2,
        'sometimes': 5,
        'often': 7,
        'constantly': 9
    }.get(anxiety_freq, 5)
    
    depression_freq = user_data.get('depressionFrequency', 'sometimes')
    depression_score = {
        'rarely': 2,
        'sometimes': 5,
        'often': 7,
        'constantly': 9
    }.get(depression_freq, 5)
    
    social_connections = user_data.get('socialConnections', 'moderate')
    social_score = {
        'limited': 3,
        'moderate': 6,
        'strong': 8,
        'very-strong': 10
    }.get(social_connections, 6)
    
    work_life_balance = user_data.get('workLifeBalance', 'moderate')
    work_life_score = {
        'poor': 2,
        'fair': 4,
        'moderate': 6,
        'good': 8,
        'excellent': 10
    }.get(work_life_balance, 6)
    
    mindfulness_practice = user_data.get('mindfulnessPractice', 'never')
    mindfulness_score = {
        'never': 0,
        'occasionally': 3,
        'weekly': 7,
        'daily': 10
    }.get(mindfulness_practice, 0)
    
    # Physical health data
    smoking_status = user_data.get('smokingStatus', 'non-smoker')
    smoking_factor = {
        'non-smoker': 0,
        'former-smoker': 0.3,
        'occasional': 0.5,
        'regular': 1.0
    }.get(smoking_status, 0)
    
    alcohol = user_data.get('alcoholConsumption', 'occasional')
    alcohol_factor = {
        'none': 0,
        'occasional': 0.2,
        'moderate': 0.5,
        'heavy': 1.0
    }.get(alcohol, 0.2)
    
    blood_pressure = user_data.get('bloodPressure', 'normal')
    bp_factor = {
        'low': 0.2,
        'normal': 0,
        'elevated': 0.3,
        'high-stage1': 0.6,
        'high-stage2': 1.0,
        'unknown': 0.3
    }.get(blood_pressure, 0)
    
    cholesterol = user_data.get('cholesterolLevels', 'normal')
    chol_factor = {
        'normal': 0,
        'borderline': 0.5,
        'high': 1.0,
        'unknown': 0.3
    }.get(cholesterol, 0)
    
    # Family history
    family_history = user_data.get('familyHistory', [])
    family_heart = 'Heart Disease' in family_history
    family_diabetes = 'Diabetes' in family_history
    family_mental = 'Mental Health Conditions' in family_history
    
    # Existing conditions
    existing_conditions = user_data.get('existingConditions', [])
    has_diabetes = 'Diabetes' in existing_conditions
    has_hypertension = 'Hypertension' in existing_conditions
    has_heart_disease = 'Heart Disease' in existing_conditions
    has_anxiety = 'Anxiety Disorder' in existing_conditions
    has_depression = 'Depression' in existing_conditions
    
    # Calculate risk scores (0-100)
    # Lower is better in our system
    
    # Cardiovascular risk - enhanced with new factors
    cardio_risk = int(
        (0.15 * age / 80 +
         0.15 * max(0, (bmi - 18.5) / 15) +
         0.10 * (7 - exercise_freq) / 7 +
         0.10 * smoking_factor +
         0.10 * alcohol_factor +
         0.15 * bp_factor +
         0.10 * chol_factor +
         0.05 * (1 if family_heart else 0) +
         0.10 * (1 if has_heart_disease else 0)) * 100
    )
    cardio_risk = min(max(cardio_risk, 10), 90)  # Cap between 10-90%
    
    # Metabolic risk - enhanced with new factors
    metabolic_risk = int(
        (0.20 * max(0, (bmi - 18.5) / 15) +
         0.15 * (10 - diet_quality) / 10 +
         0.10 * (7 - exercise_freq) / 7 +
         0.10 * (10 - water_score) / 10 +
         0.15 * chol_factor +
         0.10 * (1 if family_diabetes else 0) +
         0.15 * (1 if has_diabetes else 0) +
         0.05 * (not has_cardio)) * 100
    )
    metabolic_risk = min(max(metabolic_risk, 15), 85)  # Cap between 15-85%
    
    # Sleep risk - enhanced with new factors
    sleep_risk = int(
        (0.20 * stress_level / 10 +
         0.25 * (10 - sleep_quality_score) / 10 +
         0.15 * abs(sleep_hours - 7.5) / 3.5 +
         0.10 * alcohol_factor +
         0.10 * anxiety_score / 10 +
         0.10 * (10 - mindfulness_score) / 10 +
         0.10 * (10 - work_life_score) / 10) * 100
    )
    sleep_risk = min(max(sleep_risk, 20), 80)  # Cap between 20-80%
    
    # Mental health risk - enhanced with new factors
    mental_risk = int(
        (0.15 * stress_level / 10 +
         0.15 * anxiety_score / 10 +
         0.15 * depression_score / 10 +
         0.15 * (10 - social_score) / 10 +
         0.10 * (10 - work_life_score) / 10 +
         0.10 * (10 - mindfulness_score) / 10 +
         0.05 * (10 - sleep_quality_score) / 10 +
         0.05 * (7 - exercise_freq) / 7 +
         0.05 * (1 if family_mental else 0) +
         0.05 * (1 if has_anxiety or has_depression else 0)) * 100
    )
    mental_risk = min(max(mental_risk, 15), 75)  # Cap between 15-75%
    
    # Generate recommendations with enhanced factors
    predictions = {
        'cardiovascular': {
            'risk': cardio_risk,
            'factors': [
                {
                    'name': 'Exercise',
                    'impact': 'High positive impact' if exercise_freq >= 5 else 'Medium negative impact',
                    'suggestion': 'Continue your regular exercise routine' if exercise_freq >= 5 else 'Aim for at least 150 minutes of moderate exercise weekly'
                },
                {
                    'name': 'Diet',
                    'impact': 'Medium positive impact' if diet_quality >= 7 else 'Medium negative impact',
                    'suggestion': 'Maintain your heart-healthy diet' if diet_quality >= 7 else 'Consider reducing sodium and saturated fat intake'
                },
                {
                    'name': 'Smoking',
                    'impact': 'High positive impact' if smoking_status == 'non-smoker' else 'High negative impact',
                    'suggestion': 'Continue avoiding tobacco products' if smoking_status == 'non-smoker' else 'Quitting smoking would significantly improve your cardiovascular health'
                },
                {
                    'name': 'Blood Pressure',
                    'impact': 'Low positive impact' if blood_pressure in ['normal', 'low'] else 'Medium negative impact',
                    'suggestion': 'Continue monitoring your blood pressure regularly' if blood_pressure in ['normal', 'low'] else 'Consider lifestyle changes to improve blood pressure'
                },
                {
                    'name': 'Family History',
                    'impact': 'Medium negative impact' if family_heart else 'Low impact',
                    'suggestion': 'Regular cardiovascular checkups are recommended' if family_heart else 'Continue heart-healthy practices'
                }
            ]
        },
        'metabolic': {
            'risk': metabolic_risk,
            'factors': [
                {
                    'name': 'Diet',
                    'impact': 'High positive impact' if diet_quality >= 8 else 'Medium negative impact',
                    'suggestion': 'Continue your balanced diet approach' if diet_quality >= 8 else 'Consider reducing processed carbohydrates and added sugars'
                },
                {
                    'name': 'Exercise',
                    'impact': 'Medium positive impact' if exercise_freq >= 4 and has_cardio else 'Medium negative impact',
                    'suggestion': 'Your activity level is beneficial' if exercise_freq >= 4 and has_cardio else 'Adding cardio exercise would improve metabolic health'
                },
                {
                    'name': 'Weight Management',
                    'impact': 'Medium positive impact' if 18.5 <= bmi <= 24.9 else 'Medium negative impact',
                    'suggestion': 'Your weight is in a healthy range' if 18.5 <= bmi <= 24.9 else 'A 5-10% weight adjustment would benefit your metabolic health'
                },
                {
                    'name': 'Water Intake',
                    'impact': 'Medium positive impact' if water_intake in ['moderate', 'high'] else 'Medium negative impact',
                    'suggestion': 'Your hydration habits support good health' if water_intake in ['moderate', 'high'] else 'Increase water intake to at least 8 glasses daily'
                },
                {
                    'name': 'Cholesterol',
                    'impact': 'Medium positive impact' if cholesterol == 'normal' else 'Medium negative impact',
                    'suggestion': 'Maintain your healthy cholesterol levels' if cholesterol == 'normal' else 'Consider dietary changes to improve cholesterol levels'
                }
            ]
        },
        'sleep': {
            'risk': sleep_risk,
            'factors': [
                {
                    'name': 'Sleep Duration',
                    'impact': 'High positive impact' if 7 <= sleep_hours <= 8 else 'Medium negative impact',
                    'suggestion': 'Your sleep duration is optimal' if 7 <= sleep_hours <= 8 else f'Aim for 7-8 hours of sleep instead of your current {sleep_hours} hours'
                },
                {
                    'name': 'Sleep Quality',
                    'impact': 'High positive impact' if sleep_quality in ['good', 'excellent'] else 'Medium negative impact',
                    'suggestion': 'Your sleep quality is excellent' if sleep_quality in ['good', 'excellent'] else 'Improve your sleep environment for better quality rest'
                },
                {
                    'name': 'Stress Management',
                    'impact': 'Medium positive impact' if stress_level <= 4 else 'High negative impact',
                    'suggestion': 'Your stress management is effective' if stress_level <= 4 else 'Try meditation or deep breathing before sleep'
                },
                {
                    'name': 'Evening Routine',
                    'impact': 'Medium impact',
                    'suggestion': 'Avoid screens 1 hour before bedtime and maintain a consistent sleep schedule'
                },
                {
                    'name': 'Mindfulness Practice',
                    'impact': 'Medium positive impact' if mindfulness_practice in ['weekly', 'daily'] else 'Low negative impact',
                    'suggestion': 'Your mindfulness practice supports good sleep' if mindfulness_practice in ['weekly', 'daily'] else 'Consider adding mindfulness to your bedtime routine'
                }
            ]
        },
        'mental': {
            'risk': mental_risk,
            'factors': [
                {
                    'name': 'Stress Management',
                    'impact': 'High positive impact' if stress_level <= 3 else 'High negative impact',
                    'suggestion': 'Your stress management techniques are working well' if stress_level <= 3 else 'Consider adding daily mindfulness practice to your routine'
                },
                {
                    'name': 'Social Connections',
                    'impact': 'High positive impact' if social_connections in ['strong', 'very-strong'] else 'Medium negative impact',
                    'suggestion': 'Your social network provides excellent support' if social_connections in ['strong', 'very-strong'] else 'Try to increase meaningful social interactions weekly'
                },
                {
                    'name': 'Work-Life Balance',
                    'impact': 'Medium positive impact' if work_life_balance in ['good', 'excellent'] else 'Medium negative impact',
                    'suggestion': 'Your balance is good; continue prioritizing personal time' if work_life_balance in ['good', 'excellent'] else 'Set clearer boundaries between work and personal time'
                },
                {
                    'name': 'Physical Activity',
                    'impact': 'Medium positive impact' if exercise_freq >= 3 else 'Medium negative impact',
                    'suggestion': 'Regular exercise is benefiting your mental health' if exercise_freq >= 3 else 'Even short walks can improve mood and reduce anxiety'
                },
                {
                    'name': 'Sleep Quality',
                    'impact': 'Medium positive impact' if sleep_quality_score >= 7 else 'Medium negative impact',
                    'suggestion': 'Your sleep pattern supports good mental health' if sleep_quality_score >= 7 else 'Improving sleep consistency could benefit your mental wellbeing'
                }
            ]
        }
    }
    
    return predictions

@app.route('/')
def index():
    return jsonify({
        'service': 'Health Prediction API',
        'status': 'active',
        'endpoints': {
            '/api/predict': 'POST - Submit lifestyle data for health prediction'
        }
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        # Get data from request
        user_data = request.json
        
        # Calculate BMI if not provided
        if 'bmi' not in user_data and 'weight' in user_data and 'height' in user_data:
            user_data['bmi'] = user_data['weight'] / ((user_data['height'] / 100) ** 2)
        
        # Make predictions
        predictions = mock_predict_health_risks(user_data)
        
        return jsonify(predictions)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    # Get port from environment variable or use 5000 as default
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
