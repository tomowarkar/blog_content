# Git
alias gco='git checokut'
alias gcb='git checokut -b'
alias gl='git log'
alias grl='git reflog'
alias gri='git rebase -i HEAD~6'
alias gad='git add'
alias gcm='git commit -m'

# Shortcut
alias gws='code $GOPATH/src/go_workspace/'
alias vsc='open -a "Visual Studio Code"'
alias jn='jupyter notebook'

alias dt='cd ~/Desktop'
alias ..='cd ..'
alias vbp='vi ~/.bash_profile'
alias sbp='source ~/.bash_profile'
alias vbr='vi ~/.bashrc'
alias sbr='source ~/.bashrc'

alias now='date +%Y%m%d%H%M'

function tuf(){
  touch `now`.$1
}

function mkcd(){
  mkdir $1 && cd $1
}