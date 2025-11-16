import itertools

# EXACT sequence of authors (30%, 30%, 30%, 10% of 23 commits)
authors = [
    ("Vijay Singh", "vijayrawat289h@gmail.com"),   # 7 commits
    ("Vijay Singh", "vijayrawat289h@gmail.com"),
    ("Vijay Singh", "vijayrawat289h@gmail.com"),
    ("Vijay Singh", "vijayrawat289h@gmail.com"),
    ("Vijay Singh", "vijayrawat289h@gmail.com"),
    ("Vijay Singh", "vijayrawat289h@gmail.com"),
    ("Vijay Singh", "vijayrawat289h@gmail.com"),

    ("Raj Chuphal", "rajchuphal21@gmail.com"),     # 7 commits
    ("Raj Chuphal", "rajchuphal21@gmail.com"),
    ("Raj Chuphal", "rajchuphal21@gmail.com"),
    ("Raj Chuphal", "rajchuphal21@gmail.com"),
    ("Raj Chuphal", "rajchuphal21@gmail.com"),
    ("Raj Chuphal", "rajchuphal21@gmail.com"),
    ("Raj Chuphal", "rajchuphal21@gmail.com"),

    ("Devesh Joshi", "joshidevesh2006@gmail.com"), # 7 commits
    ("Devesh Joshi", "joshidevesh2006@gmail.com"),
    ("Devesh Joshi", "joshidevesh2006@gmail.com"),
    ("Devesh Joshi", "joshidevesh2006@gmail.com"),
    ("Devesh Joshi", "joshidevesh2006@gmail.com"),
    ("Devesh Joshi", "joshidevesh2006@gmail.com"),
    ("Devesh Joshi", "joshidevesh2006@gmail.com"),

    ("Vanshika Khanduri", "vanshikakhanduri97@gmail.com") # 2 commits (~10%)
]

author_cycle = itertools.cycle(authors)

def callback(commit, metadata):
    name, email = next(author_cycle)
    commit.author_name = name
    commit.author_email = email
    commit.committer_name = name
    commit.committer_email = email
