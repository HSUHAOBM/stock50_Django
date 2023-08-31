from django.db import models
from member.models import Member
from stock.models import Stock

# 留言
class MessageBoard(models.Model):
    STOCK_STATUS = [
        ('-1', '下跌'),
        ('0', '持平'),
        ('1', '上漲'),
    ]
    CHECK_STATUS = [
        ('0', '失敗'),
        ('1', '成功'),
    ]
    stock = models.ForeignKey(Stock, related_name='stock_messages', on_delete=models.CASCADE)
    stock_status = models.CharField(max_length=2, choices=STOCK_STATUS, null=True, blank=True)
    check_status = models.CharField(max_length=2, choices=CHECK_STATUS, null=True, blank=True)
    text = models.TextField(null=True, blank=True)
    create_id = models.ForeignKey(Member, null=True, on_delete=models.SET_NULL, related_name='created_messages')
    write_id = models.ForeignKey(Member, null=True, on_delete=models.SET_NULL, related_name='written_messages')
    create_date = models.DateTimeField(auto_now_add=True)
    write_date = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'message_board'

    def __str__(self):
        return f"{self.create_id.name} - {self.text}"



class MessageBoardLike(models.Model):
    message = models.ForeignKey(MessageBoard, on_delete=models.CASCADE, related_name='like_marks')
    create_date = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(Member, related_name='like_message')

    class Meta:
        db_table = 'message_board_like'

    def __str__(self):
        return f"like mark to message: {self.message}"

# 回覆留言
class MessageBoardReply(models.Model):
    message = models.ForeignKey(MessageBoard, on_delete=models.CASCADE, related_name='replies')
    text = models.TextField()
    create_id = models.ForeignKey(Member, null=True, on_delete=models.SET_NULL, related_name='member_replies')
    create_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'message_board_reply'

    def __str__(self):
        return f"Reply by {self.create_id.name} to message: {self.message}"

