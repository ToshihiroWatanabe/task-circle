package app.taskcircle.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import app.taskcircle.model.Session;

/**
 * sessionsテーブルのマッパーインターフェースです。
 */
@Mapper
public interface SessionMapper {

    /**
     * セッション情報を取得します。
     * 
     * @return セッションのリスト
     */
    public List<Session> findAll();

    /**
     * セッションを作成します。
     * 
     * @param session セッション
     * @return 成功した場合はtrue
     */
    public boolean create(Session session);

    /**
     * セッション情報を更新します。
     * 
     * @param session セッション
     * @return 成功した場合はtrue
     */
    public boolean update(Session session);

    /**
     * セッションを削除します。
     * 
     * @param session セッション
     * @return 成功した場合はtrue
     */
    public boolean delete(Session session);

    /**
     * セッションを全て削除します。
     * 
     * @return 成功した場合はtrue
     */
    public boolean deleteAll();
}
