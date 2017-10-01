# Git conventions

## Rationale
Git can quickly become unruly if used without any discipline,  
thereforce some minor conventions have been put down.  

## Branch strategy
All "major" development will happen on a branch which has  
the same name as the issue it is related to in JIRA.  
Minor editions can be done right in the sprint branch, but please avoid it.  

The issue branches will be branched out from the main sprint branch,  
named sprint_{sprint_number}.  
After an issue has been fixed, it will be merged back into the sprint  
branch after it has been approved by another reviewer.  
After a merge the issue branch is deleted.  

Once a sprint is over, the sprint branch is merged into dev for further  
testing, before being merged into master when we are ready to release a new verison.  

All merging is done by Per-Morten, to maintain a consistent style and avoid  
having to constantly discuss who is merging what into different branches.  

## Commit messages
Commit messages should start with the GLM-{issue\_number} if it is related to an issue.  
The commit message should also be written in imperative form in the heading.  
If the commit can be summed up in under 50 characters, you can use the normal git commit -m,  
however, if the commit needs a bit more explaining, it should comply with the following format.  

```sh
<issue_number> Summary (under 50 characters total!)
<empty_line>
Additional information (Try to keep each line within 80 characters)

 <JIRA_commands> (Notice initial whitespace to avoid git ignoring lines starting with #)
```

Example:
```sh
GLM-15 Fix bug related to invalid input

The bug in which users could create matches without valid ip 
addresses is now fixed.

 #time 1h
 #close
```

Please do explain in your commits what you have done and why, unless it is super obvious.  
For example, with bugs, explain why the fix works.  
Commit messages like just: fix bug, doesn't really help anyone.  

## Reviews
Each pull request must go through a review before it can be merged into the sprint branch.  
When creating a pull request remember to request a reviewer.  
Also announce this reviewer on the discord channel, so we can more easily be notified,  
and also see who is reviewing what.  

### Things to look for
Below are some of the things to look for when reviewing code.  

#### Formatting & Naming
Is the code formatted properly with good name that makes it obvious what is happening?  

#### Commenting
Is there anything in the code that isn't obvious so it should have been commented more?  

#### Documentation
Does the documentation match what the code is actually doing?  

#### Obvious bugs
Notice any obvious bugs, or something else that the developer has not taken into account?  

#### Test cases
Is the code missing any obvious test cases?  
For example, does the test only test what happends with valid input?  

#### Wrong use of HTTP codes
Network programming is new to all of us, so it might be that we are using the wrong HTTP  
status codes from time to time.

If possible (and convenient) pull the code down and check that it runs correctly and passes all the tests.  
