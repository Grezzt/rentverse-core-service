#!/bin/bash

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

clear

printf "${PURPLE}╔═══════════════════════════════════════════════════════════════════════════════╗${NC}\n"
printf "${PURPLE}║${WHITE}                        🧪 TESTING HUSKY HOOKS                                ${PURPLE}║${NC}\n"
printf "${PURPLE}╚═══════════════════════════════════════════════════════════════════════════════╝${NC}\n"
printf "\n"

printf "${CYAN}🎯 This will test your Husky configuration...${NC}\n"
printf "\n"

# Test pre-push hook
printf "${BLUE}┌──────────────────────────────────────────────────────────────────────────────┐${NC}\n"
printf "${BLUE}│${WHITE} 🚀 Testing Pre-Push Hook                                                  ${BLUE}│${NC}\n"
printf "${BLUE}└──────────────────────────────────────────────────────────────────────────────┘${NC}\n"
printf "\n"

./.husky/pre-push

if [ $? -eq 0 ]; then
    printf "\n"
    printf "${GREEN}🎉 Pre-push hook test completed successfully!${NC}\n"
else
    printf "\n"
    printf "${RED}❌ Pre-push hook test failed!${NC}\n"
fi

printf "\n"
printf "${YELLOW}💡 To test pre-commit hook, make some changes and run:${NC}\n"
printf "${WHITE}   git add . && git commit -m \"test commit\"${NC}\n"
printf "\n"
printf "${CYAN}📝 Your Husky hooks are now configured with beautiful output! ✨${NC}\n"