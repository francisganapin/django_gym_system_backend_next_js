# Add Member API integration fix

Date: 2025-12-19

## Summary
Fixed the frontend POST request to the Django REST Framework (DRF) endpoint so it uses the correct media type and field names expected by the backend. This resolves the 415 Unsupported Media Type error and prevents validation issues from unknown/mismatched fields.

Endpoint: http://127.0.0.1:8000/api/member_portal/
Frontend file: app/add-member/page.tsx
Backend files: gym_backend/member_portal/models.py, gym_backend/member_portal/serializers.py

## Problem
- The request was sent without Content-Type, defaulting to text/plain;charset=UTF-8, which DRF rejects for JSON payloads (415 Unsupported Media Type).
- Field names in the payload did not align with the backend model/serializer (phone vs phone_number, membership_type vs membership).
- Additional fields were included that the backend did not expect in JSON (image as base64, join_date which is auto-set on the server, and date_of_birth which is not on the model).

## Root cause
- DRF requires explicit Content-Type: application/json when sending JSON bodies.
- Member_Portal model and MemberPortalSerializer define specific fields:
  - Phone should be phone_number
  - Membership should be membership
  - image is an ImageField (file upload), not base64 in JSON
  - join_date is auto_now_add=True; server sets it

## Changes
1) Set proper headers for JSON
- Added headers: Content-Type: application/json and Accept: application/json.

2) Align payload keys to backend schema
- phone -> phone_number
- membership_type -> membership

3) Omit unsupported/auto-managed fields from JSON
- Removed date_of_birth, join_date, and image (base64) from the JSON payload.

This makes the request compatible with the DRF ModelViewSet for Member_Portal.

## Before (simplified)
- No Content-Type header (defaults to text/plain)
- Payload keys: phone, membership_type
- Included base64 image, date_of_birth, join_date

Result: 415 Unsupported Media Type and potential validation errors.

## After (simplified)
- Headers:
  - Content-Type: application/json
  - Accept: application/json
- Payload keys: phone_number, membership
- Omitted image, date_of_birth, join_date from JSON

Result: Request is accepted by DRF and member is created.

## If photo upload is required
Because image is an ImageField, use multipart/form-data. Steps:
- Keep the JSON-based flow for text-only creation OR
- Switch to FormData and append the actual File object (not base64). Do not set Content-Type manually; the browser will set the proper boundary.

Example outline (React):
- const fd = new FormData()
- fd.append('first_name', firstName)
- fd.append('last_name', lastName)
- fd.append('phone_number', phone)
- fd.append('membership', membershipType)
- if (file) fd.append('image', file) // real File from <input type="file" />
- fetch(url, { method: 'POST', body: fd })

Note: Do not set Content-Type for FormData requests.

## Testing
- Submit the Add Member form with first name, last name, email, phone, membership.
- Expect 201 Created and a JSON response containing the created member data.
- Verify in the database/admin that join_date is set by the server and image is empty unless using multipart upload.

## Rationale
- Conforms to DRF media type handling.
- Matches backend schema to avoid validation errors.
- Keeps server as the source of truth for auto-managed fields.

## Changelog
- app/add-member/page.tsx: Add JSON headers; update payload keys; remove unsupported fields from JSON body.
