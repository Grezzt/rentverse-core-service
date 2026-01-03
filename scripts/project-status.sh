#!/bin/bash

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

clear

printf "${CYAN}╔═══════════════════════════════════════════════════════════════════════════════╗${NC}\n"
printf "${CYAN}║${WHITE}                          🏠 RENTVERSE PROJECT STATUS                         ${CYAN}║${NC}\n"
printf "${CYAN}╚═══════════════════════════════════════════════════════════════════════════════╝${NC}\n"
printf "\n"

# Project info
printf "${BLUE}📋 Project Information${NC}\n"
printf "${GRAY}─────────────────────────────────────────────────────────────────────────────────${NC}\n"
printf "${WHITE}   Name:${NC} Rentverse Backend API\n"
printf "${WHITE}   Type:${NC} Node.js Express API with Prisma ORM\n"
printf "${WHITE}   Database:${NC} PostgreSQL\n"
printf "\n"

# Git status
printf "${BLUE}🔄 Git Status${NC}\n"
printf "${GRAY}─────────────────────────────────────────────────────────────────────────────────${NC}\n"
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "not-git-repo")
if [ "$BRANCH" != "not-git-repo" ] && [ -n "$BRANCH" ]; then
    printf "   ${WHITE}Current Branch:${NC} ${CYAN}$BRANCH${NC}\n"
    
    # Check if there are uncommitted changes
    if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
        printf "   ${WHITE}Status:${NC} ${YELLOW}⚠️  Uncommitted changes${NC}\n"
    else
        printf "   ${WHITE}Status:${NC} ${GREEN}✅ Clean working directory${NC}\n"
    fi
else
    printf "   ${WHITE}Status:${NC} ${RED}❌ Not a git repository${NC}\n"
fi
printf "\n"

# Code quality status
printf "${BLUE}🎯 Code Quality Status${NC}\n"
printf "${GRAY}─────────────────────────────────────────────────────────────────────────────────${NC}\n"

# Check linting
printf "${WHITE}   ESLint:${NC} "
if pnpm run lint >/dev/null 2>&1; then
    printf "${GREEN}✅ No linting errors${NC}\n"
else
    printf "${RED}❌ Linting errors found${NC}\n"
fi

# Check formatting
printf "${WHITE}   Prettier:${NC} "
if pnpm run format:check >/dev/null 2>&1; then
    printf "${GREEN}✅ Code properly formatted${NC}\n"
else
    printf "${YELLOW}⚠️  Formatting issues found${NC}\n"
fi

printf "\n"

# Security status
printf "${BLUE}🔒 Security Status${NC}\n"
printf "${GRAY}─────────────────────────────────────────────────────────────────────────────────${NC}\n"

printf "${WHITE}   Vulnerabilities:${NC} "
if pnpm run security:check >/dev/null 2>&1; then
    printf "${GREEN}✅ No security vulnerabilities${NC}\n"
else
    printf "${RED}🚨 Security vulnerabilities detected${NC}\n"
fi

printf "\n"

# Available commands
printf "${BLUE}🚀 Quick Commands${NC}\n"
printf "${GRAY}─────────────────────────────────────────────────────────────────────────────────${NC}\n"
printf "${WHITE}   Development:${NC}\n"
printf "     ${CYAN}pnpm run dev${NC}           - Start development server\n"
printf "     ${CYAN}pnpm run db:studio${NC}     - Open Prisma Studio\n"
printf "\n"
printf "${WHITE}   Code Quality:${NC}\n"
printf "     ${CYAN}pnpm run code:check${NC}    - Check linting & formatting\n"
printf "     ${CYAN}pnpm run code:fix${NC}      - Auto-fix linting & formatting\n"
printf "\n"
printf "${WHITE}   Security:${NC}\n"
printf "     ${CYAN}pnpm run security:check${NC} - Check for vulnerabilities\n"
printf "     ${CYAN}pnpm audit --fix${NC}       - Fix vulnerabilities\n"
printf "\n"
printf "${WHITE}   Database:${NC}\n"
printf "     ${CYAN}pnpm run db:migrate${NC}    - Run database migrations\n"
printf "     ${CYAN}pnpm run db:seed${NC}       - Seed database with sample data\n"
printf "\n"

printf "${PURPLE}🎉 Happy coding! Remember: Quality code is secure code! 🛡️${NC}\n"
printf "\n"