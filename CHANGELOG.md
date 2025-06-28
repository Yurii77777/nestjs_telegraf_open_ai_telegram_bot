# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Sections list

### Added

### Changed

### Fixed

### Removed

### BREAKING CHANGES

### Docs

## [2.0.0] - 28.06.2025

### Added

- Added new env = ADMIN_PHONE_NUMBER;
- Added new command = 'search_and_publish' to check user permissions;
- Added a new 'sharePhone' utility to allow users to share their real phone number;

### Changed
- Post processing for the Telegram channel has been moved to a separate handler. User access is also checked here.
