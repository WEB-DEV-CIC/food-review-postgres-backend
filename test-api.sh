#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL from environment variable or default
BASE_URL=${API_URL:-"http://localhost:5000/api/v1"}

# Function to print section headers
print_header() {
    echo -e "\n${BLUE}=== $1 ===${NC}\n"
}

# Function to print error and exit
print_error() {
    echo -e "${RED}Error: $1${NC}"
    exit 1
}

# Function to make API calls and handle responses
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=${4:-200}
    
    echo -e "${BLUE}Testing $method $endpoint${NC}"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint")
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}Success (Status: $status_code)${NC}"
        echo "Response: $body" | jq '.' 2>/dev/null || echo "Response: $body"
    else
        echo -e "${RED}Failed (Status: $status_code)${NC}"
        echo "Response: $body" | jq '.' 2>/dev/null || echo "Response: $body"
        print_error "API call failed with status code $status_code"
    fi
    echo
}

# Check if server is running
echo -e "${YELLOW}Checking if server is running...${NC}"
if ! curl -s "$BASE_URL/foods" > /dev/null; then
    print_error "Server is not running at $BASE_URL"
fi

# Test Food Endpoints
print_header "Testing Food Endpoints"

# Create a new food item
FOOD_DATA='{
    "name": "Test Food",
    "description": "A test food item",
    "region": "Test Region",
    "ingredients": ["ingredient1", "ingredient2"],
    "tasteProfile": ["sweet", "spicy"],
    "dietaryRestrictions": ["vegetarian"],
    "imageUrl": "https://example.com/test.jpg",
    "rating": 4.5,
    "reviewCount": 0
}'

# Create food and capture the ID
print_header "Creating new food"
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/foods" \
    -H "Content-Type: application/json" \
    -d "$FOOD_DATA")
FOOD_ID=$(echo $CREATE_RESPONSE | jq -r '._id')

if [ -n "$FOOD_ID" ] && [ "$FOOD_ID" != "null" ]; then
    echo -e "${GREEN}Created food with ID: $FOOD_ID${NC}"
    
    # Get all foods
    print_header "Getting all foods"
    make_request "GET" "/foods"
    
    # Get specific food
    print_header "Getting specific food"
    make_request "GET" "/foods/$FOOD_ID"
    
    # Update food
    print_header "Updating food"
    UPDATE_DATA='{
        "rating": 4.8,
        "reviewCount": 1
    }'
    make_request "PUT" "/foods/$FOOD_ID" "$UPDATE_DATA"
    
    # Test filters
    print_header "Testing filters"
    make_request "GET" "/foods?region=Test%20Region"
    make_request "GET" "/foods?tasteProfile=spicy"
    make_request "GET" "/foods?dietaryRestrictions=vegetarian"
    
    # Delete food
    print_header "Deleting food"
    make_request "DELETE" "/foods/$FOOD_ID"
else
    print_error "Failed to create test food. Response: $CREATE_RESPONSE"
fi

# Test Review Endpoints
print_header "Testing Review Endpoints"

# Create a new review
REVIEW_DATA='{
    "foodId": "'$FOOD_ID'",
    "userId": "test-user-123",
    "rating": 5,
    "comment": "This is a test review",
    "tasteProfile": ["sweet", "spicy"],
    "dietaryRestrictions": ["vegetarian"]
}'

# Create review and capture the ID
print_header "Creating new review"
CREATE_REVIEW_RESPONSE=$(curl -s -X POST "$BASE_URL/reviews" \
    -H "Content-Type: application/json" \
    -d "$REVIEW_DATA")
REVIEW_ID=$(echo $CREATE_REVIEW_RESPONSE | jq -r '._id')

if [ -n "$REVIEW_ID" ] && [ "$REVIEW_ID" != "null" ]; then
    echo -e "${GREEN}Created review with ID: $REVIEW_ID${NC}"
    
    # Get all reviews
    print_header "Getting all reviews"
    make_request "GET" "/reviews"
    
    # Get specific review
    print_header "Getting specific review"
    make_request "GET" "/reviews/$REVIEW_ID"
    
    # Update review
    print_header "Updating review"
    UPDATE_REVIEW_DATA='{
        "rating": 4,
        "comment": "Updated test review"
    }'
    make_request "PUT" "/reviews/$REVIEW_ID" "$UPDATE_REVIEW_DATA"
    
    # Delete review
    print_header "Deleting review"
    make_request "DELETE" "/reviews/$REVIEW_ID"
else
    print_error "Failed to create test review. Response: $CREATE_REVIEW_RESPONSE"
fi

echo -e "\n${GREEN}=== All API Tests Completed Successfully ===${NC}\n" 